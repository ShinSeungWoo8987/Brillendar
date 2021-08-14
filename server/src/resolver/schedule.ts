import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';

import { hasAuth } from '../functions/auth';
import { SchemaContext } from '../types';
import { FieldError } from './FieldError';
import { v4 as uuid } from 'uuid';
import { Schedule } from '../entity/Schedule';
import { Tag } from '../entity/Tag';
import ScheduleDetails, { ScheduleImg } from '../mongodb/models/ScheduleDetails';
import { getRepository, Raw } from 'typeorm';
import { Member } from '../entity/Member';
import { Follow } from '../entity/Follow';
import { Like } from '../entity/Like';
import { report, send } from 'process';
import Comment from '../mongodb/models/Comment';

type TempSchedule = {
  id: string;
  mongo_id: string;
  open: boolean;
  like_count: number;
  start_at: Date;
  finish_at: Date;
  writer_id: string;
  username: string;
  profile_img: string | undefined;
  follower_count: number;
  tags: Tag[];
  isLike: boolean;
};

type ScheduleWithDetails = TempSchedule & {
  title: string;
  description: string;
  comment_count?: number;
  result_img?: ScheduleImg[];
  result_description?: string;
};

@InputType()
class ScheduleInput {
  @Field()
  title!: string;
  @Field()
  description!: string;
  @Field()
  start_at!: number;
  @Field()
  finish_at!: number;
  @Field()
  open!: boolean;
}

@InputType()
class FeedInput {
  @Field()
  day_start!: number;
  @Field()
  day_end!: number;
}

@InputType()
class ScheduleRequest {
  @Field()
  id!: string;
  @Field()
  month_start!: number;
  @Field()
  month_end!: number;
}

@ObjectType()
class ScheduleAndIsLike extends Schedule {
  @Field(() => Boolean)
  isLike!: boolean;
}

//  ScheduleAndIsLike & ScheduleDetailsResponse
@ObjectType()
class CombinedSchedule extends ScheduleAndIsLike {
  @Field()
  title!: string;
  @Field()
  description!: string;
  @Field()
  comment_count?: number;

  @Field(() => [ScheduleImg])
  result_img?: ScheduleImg[];
  @Field(() => String, { nullable: true })
  result_description?: string;
}

@ObjectType()
class FeedMember {
  @Field()
  id!: string;
  @Field()
  username!: string;
  @Field(() => String, { nullable: true })
  profile_img?: string;
  @Field()
  follower_count!: number;
}

@ObjectType()
class ScheduleResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;

  @Field(() => Schedule, { nullable: true })
  Schedule?: Schedule;

  @Field(() => [CombinedSchedule], { nullable: true })
  Schedules?: CombinedSchedule[];

  @Field(() => Boolean, { nullable: true })
  readable?: boolean;

  @Field(() => Boolean, { nullable: true })
  following?: boolean;
}

@ObjectType()
class Feed {
  @Field(() => FeedMember)
  member!: FeedMember;

  @Field(() => [CombinedSchedule])
  schedules!: CombinedSchedule[];
}

@ObjectType()
class FeedResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;

  @Field(() => [Feed], { nullable: true })
  feed?: Feed[];
}

// ////////////////////////////

@Resolver()
export class ScheduleResolver {
  @Mutation(() => ScheduleResponse)
  @UseMiddleware(hasAuth)
  async createSchedule(
    @Ctx() { req, payload, error }: SchemaContext,
    @Arg('schedule')
    { open, title, description, start_at, finish_at }: ScheduleInput,

    @Arg('tags', () => [String]) tags: string[]
  ): Promise<ScheduleResponse> {
    const start = new Date(start_at);
    const finish = new Date(finish_at);

    if (error) return { error };

    try {
      // 몽고db에 넣기 이후 uid받아오기
      const scheduleDetails = await ScheduleDetails.create({ title, description });
      const mongo_id = String(scheduleDetails._id);

      const schedule_id = uuid();

      const newSchedule = await Schedule.create({
        id: schedule_id,
        open,
        writer_id: payload!.id,
        start_at: start,
        finish_at: finish,
        mongo_id,
      }).save();

      const newTags = tags.map((tagStr, idx) => {
        const tag = new Tag();
        tag.schedule_id = schedule_id;
        tag.tag = tagStr;
        tag.idx = idx;

        return tag;
      });

      await Tag.save(newTags);

      return { Schedule: newSchedule };
    } catch (err) {
      return { error: { field: 'createSchedule', message: 'Cannot create schedule' } };
    }
  }

  // 한달치 스케줄 가져오기
  @Query(() => ScheduleResponse)
  @UseMiddleware(hasAuth)
  async readMonthSchedule(
    @Ctx() { req, payload, error }: SchemaContext,
    @Arg('scheduleRequest') { id, month_start, month_end }: ScheduleRequest
  ): Promise<ScheduleResponse> {
    if (error) return { error };

    try {
      let following = false;
      const request_id = payload!.id;
      const target_id = id;

      if (request_id !== target_id) {
        // 나와의 관계 조회
        const follow = await Follow.findOne({ member_id: request_id, target_id, relation: 2 });

        if (!follow) {
          // 팔로잉중이 아니므로 해당 계정이 private인지 조회
          const target = await Member.findOne({ id: target_id });

          if (!target) {
            // 조회가 안되면 에러
            return { error: { field: '', message: '' } };
          }

          if (target && target.private) {
            // 조회가 되었지만, 프라이빗 계정이면 조회 불가능.
            return { readable: false };
          }
        } else {
          following = true;
        }
      }

      // 여기까지 걸리는게 없으면 스케줄 조회 가능
      const rawSchedules: (Schedule & Like & Tag)[] = await getRepository(Schedule)
        .createQueryBuilder('s')
        .leftJoin(Tag, 't', 's.id = t.schedule_id')
        // .leftJoin(Like, 'l', 's.id = l.schedule_id')
        .leftJoinAndMapMany(
          's.likes',
          (qb) => {
            return qb.select('*').from(Like, 'like').where('like.member_id = :request_id', { request_id });
          },
          'l',
          's.id = l.schedule_id'
        )
        .select('*')
        .where('s.writer_id = :target_id', { target_id })
        .andWhere(request_id !== target_id ? 's.open = true' : 'true')
        .andWhere('UNIX_TIMESTAMP(start_at) >= :start', { start: month_start / 1000 })
        .andWhere('UNIX_TIMESTAMP(start_at) < :finish', { finish: month_end / 1000 })
        .orderBy('s.start_at', 'ASC')
        .addOrderBy('t.idx', 'ASC')
        .getRawMany();

      // 그룹화으로 묶고, 좋아요 눌렀는지 아닌지 true/false로 나누기.
      let temp_ids = rawSchedules.map((t) => t.id);
      // 중복제거
      const schedule_ids = [...new Set(temp_ids)];

      let schedules: ScheduleAndIsLike[] = [];

      schedule_ids.forEach((selectedId) => {
        const selectedSchedules: (Schedule & Like & Tag)[] = rawSchedules.filter((t) => t.id === selectedId);

        let tags: Tag[] = [];
        selectedSchedules.forEach((s) => {
          if (s.idx !== null && s.tag !== null) tags.push({ idx: s.idx, tag: s.tag } as Tag);
        });
        // 같은 코드
        // const tempTags: Tag[] = selectedSchedules.map((s) => ({ idx: s.idx, tag: s.tag } as Tag));
        // const tags = tempTags.filter((t) => t.idx !== null && t.tag !== null);

        const { id, writer_id, mongo_id, open, start_at, finish_at, like_count, schedule_id, member_id } =
          selectedSchedules[0];

        let isLike = schedule_id && member_id ? true : false;

        const temp: ScheduleAndIsLike = {
          id,
          writer_id,
          mongo_id,
          open,
          start_at,
          finish_at,
          like_count,
          isLike,
          tags,
        } as ScheduleAndIsLike;

        schedules.push(temp);
      });
      //////////////////////

      const mongo_ids = schedules.map((schedule) => schedule.mongo_id);

      const scheduleDetails = await ScheduleDetails.find({ _id: { $in: mongo_ids } }).exec();

      const temp = schedules.map((schedule) => {
        const find = scheduleDetails.filter((sd) => String(sd._id) === schedule.mongo_id)[0];
        const { title, description, comment_count, result_description, result_img } = find;

        if (find) {
          return {
            ...schedule,
            title,
            description,
            comment_count,

            result_description: result_description ? result_description : '',
            result_img,
          };
        } else {
          return null;
        }
      });
      const final = temp.filter((t) => t !== null) as CombinedSchedule[];

      return { readable: true, Schedules: final, following };
    } catch (err) {
      console.log(err);
      return { error: { field: '', message: '' } };
    }
  }

  // 결과 삭제
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async deleteScheduleResult(
    @Ctx() { req, payload, error }: SchemaContext,
    @Arg('mongo_id') mongo_id: string
  ): Promise<boolean> {
    const writer = await Schedule.findOne({ mongo_id, writer_id: payload!.id });

    if (!writer) return false;

    await ScheduleDetails.findOneAndUpdate({ _id: mongo_id }, { result_description: '', result_img: [] }).exec();
    return true;
  }

  // 스케줄 삭제
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async deleteSchedule(
    @Ctx() { req, payload, error }: SchemaContext,
    @Arg('mongo_id') mongo_id: string
  ): Promise<boolean> {
    try {
      const writer = await Schedule.delete({ mongo_id, writer_id: payload!.id });

      if (writer.affected !== 0) {
        const scheduleDetails = await ScheduleDetails.deleteOne({ _id: mongo_id });
        if (scheduleDetails.ok !== 1) throw new Error();

        const comments = await Comment.deleteMany({ schedule_mongo_id: mongo_id });
        if (comments.ok !== 1) throw new Error();
      } else {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 피드 받아오기
  @Query(() => FeedResponse)
  @UseMiddleware(hasAuth)
  async readFeedSchedule(
    @Ctx() { req, payload, error }: SchemaContext,

    @Arg('feedInput') { day_start, day_end }: FeedInput
  ): Promise<FeedResponse> {
    if (error) return { error };

    try {
      const member_id = payload!.id;

      const rawFeed: (Member & Schedule & Like & Tag)[] = await getRepository(Follow)
        .createQueryBuilder('f')
        .leftJoin(Member, 'm', 'f.target_id = m.id')
        .leftJoin(Schedule, 's', 'f.target_id = s.writer_id')
        .leftJoin(Tag, 't', 's.id = t.schedule_id')
        // .leftJoin(Like, 'l', 's.id = l.schedule_id')
        .leftJoinAndMapMany(
          's.likes',
          (qb) => {
            return qb.select('*').from(Like, 'like').where('like.member_id = :member_id', { member_id });
          },
          'l',
          's.id = l.schedule_id'
        )
        // .select('*')
        .select(
          `
          s.id,s.writer_id,s.mongo_id,s.open,s.like_count,s.start_at,s.finish_at,
          t.tag,t.idx,
          l.member_id,l.schedule_id,
          m.username,m.profile_img,m.follower_count
          `
          // m.id는 s.writer_id와 같아서 생략함.

          // [
          //   's.id',
          //   's.writer_id',
          //   's.mongo_id',
          //   's.open',
          //   's.like_count',
          //   's.start_at',
          //   's.finish_at',
          //   't.tag',
          //   't.idx',
          //   'l.member_id',
          //   'l.schedule_id',
          //   'm.id',
          //   'm.username',
          //   'm.profile_img',
          //   'm.follower_count',
          // ]
        )
        .where('f.member_id = :member_id', { member_id })
        .andWhere('s.open = true')
        .andWhere('f.relation = 2')
        .andWhere('UNIX_TIMESTAMP(start_at) >= :start', { start: day_start / 1000 })
        .andWhere('UNIX_TIMESTAMP(start_at) < :finish', { finish: day_end / 1000 })
        .orderBy('s.start_at', 'ASC')
        .addOrderBy('t.idx', 'ASC')
        .getRawMany();

      //   .innerJoinAndMapMany(
      //     'm.schedules',
      //     (qb) => {
      //       return qb
      //         .select('*')
      //         .from(Schedule, 's')
      //         .where('UNIX_TIMESTAMP(s.start_at) >= :start', { start: day_start / 1000 })
      //         .andWhere('UNIX_TIMESTAMP(s.start_at) < :finish', { finish: day_end / 1000 });
      //     },
      //     's',
      //     'f.target_id = s.writer_id'
      //   )

      // /////////////////////////////////////////////////////////////////////////

      // 스케줄 id별로 묶고, 좋아요 눌렀는지 아닌지 true/false로 나누기.
      let temp_ids = rawFeed.map((t) => t.id);
      // 중복제거
      const schedule_ids = [...new Set(temp_ids)];

      let schedules: TempSchedule[] = [];

      schedule_ids.forEach((selectedId) => {
        const selectedSchedules: (Member & Schedule & Like & Tag)[] = rawFeed.filter((t) => t.id === selectedId);

        let tags: Tag[] = [];
        selectedSchedules.forEach((s) => {
          if (s.idx !== null && s.tag !== null) tags.push({ idx: s.idx, tag: s.tag } as Tag);
        });

        const {
          id,
          writer_id,
          mongo_id,
          open,
          like_count,
          start_at,
          finish_at,
          member_id,
          schedule_id,
          username,
          profile_img,
          follower_count,
        } = selectedSchedules[0];

        let isLike = schedule_id && member_id ? true : false;

        const tempSchedule: TempSchedule = {
          id,
          mongo_id,
          open,
          like_count,
          start_at,
          finish_at,

          writer_id,
          username,
          profile_img,
          follower_count,

          tags,
          isLike,
        };

        schedules.push(tempSchedule);
      });

      // /////////////////////////////////////////////////////////////////////////
      const mongo_ids = schedules.map((schedule) => schedule.mongo_id);

      const scheduleDetails = await ScheduleDetails.find({ _id: { $in: mongo_ids } }).exec();

      const temp: (ScheduleWithDetails | null)[] = schedules.map((schedule) => {
        const find = scheduleDetails.filter((sd) => String(sd._id) === schedule.mongo_id)[0];
        const { title, description, comment_count, result_description, result_img } = find;

        if (find) {
          return {
            ...schedule,
            title,
            description,
            comment_count,

            result_description: result_description ? result_description : '',
            result_img,
          };
        } else {
          return null;
        }
      });
      const schedulesGroupByScheduleId = temp.filter((t) => t !== null) as ScheduleWithDetails[];

      // /////////////////////////

      const temp_writer_ids = schedulesGroupByScheduleId.map((data) => data!.writer_id);

      // 중복제거
      const writer_ids = [...new Set(temp_writer_ids)];

      let finalFeed: Feed[] = writer_ids.map((writerId) => {
        const filteredSchedules = schedulesGroupByScheduleId.filter((data) => data!.writer_id === writerId);
        const schedules = filteredSchedules.map(
          ({
            id,
            mongo_id,
            open,
            like_count,
            start_at,
            finish_at,
            tags,
            isLike,
            title,
            description,
            comment_count,
            result_img,
            result_description,
            writer_id,
          }) => ({
            id,
            mongo_id,
            open,
            like_count,
            start_at,
            finish_at,
            tags,
            isLike,
            title,
            description,
            comment_count,
            result_img,
            result_description,
            writer_id,
          })
        );
        const member: FeedMember = {
          id: filteredSchedules[0]!.writer_id,
          username: filteredSchedules[0]!.username,
          profile_img: filteredSchedules[0]!.profile_img,
          follower_count: filteredSchedules[0]!.follower_count,
        };

        return { member, schedules } as Feed;
      });

      return { feed: finalFeed };
    } catch (err) {
      console.log(err);
      return { error: { field: '', message: '' } };
    }
  }

  // @Query(() => String)
  // async sssss(@Arg('start') start: number, @Arg('finish') finish: number): Promise<string> {
  //   const test = await Schedule.find({
  //     join: {
  //       alias: 'schedule',
  //       leftJoinAndSelect: {
  //         tags: 'schedule.tags',
  //       },
  //     },
  //     where: [
  //       { writer_id: '7639b7e3-e86d-413a-aa7a-f1a56d94ecd3' },
  //       { start_at: Raw((alias) => `UNIX_TIMESTAMP(${alias}) >= ':start'`, { start: start / 1000 }) },
  //       { start_at: Raw((alias) => `UNIX_TIMESTAMP(${alias}) < ':finish'`, { finish: finish / 1000 }) },
  //     ],
  //     order: {},
  //   });

  //   console.log(test);

  //   return 'test2';
  // }

  //     const schedules = await Schedule.find({
  //       join: {
  //         alias: 'schedule',
  //         leftJoinAndSelect: {
  //           tags: 'schedule.tags',
  //           // likes: 'schedule.likes',
  //         },
  //       },
  //       where: {
  //         writer_id: id,
  //         start_at: Raw((alias) => `UNIX_TIMESTAMP(${alias}) >= ':start' and UNIX_TIMESTAMP(${alias}) < ':finish'`, {
  //           start: month_start / 1000,
  //           finish: month_end / 1000,
  //         }),
  //       },
  //       order: { start_at: 'ASC' },
  //     });
}
