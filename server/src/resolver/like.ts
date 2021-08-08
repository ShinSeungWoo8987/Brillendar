import { Resolver, Query, Arg, Mutation, InputType, Field, ObjectType, Ctx, UseMiddleware } from 'type-graphql';
import argon2 from 'argon2';
import { FieldError } from './FieldError';
import { SchemaContext } from '../types';
import { createAccessToken, hasAuth, logout, randomVersion, sendRefreshToken } from '../functions/auth';
import { verify } from 'jsonwebtoken';
import { getConnection, getRepository } from 'typeorm';
import { Follow } from '../entity/Follow';
import { Member } from '../entity/Member';
import ScheduleDetails from '../mongodb/models/ScheduleDetails';
import { Tag } from '../entity/Tag';
import { Like } from '../entity/Like';

@ObjectType()
class LikeResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
  @Field(() => [Like], { nullable: true })
  likes?: Like[];
}

/* ----------------------------------------------------------------------- */
@Resolver()
export class LikeResolver {
  // 스케줄 id로 좋아요한 회원목록 가져오기
  @Query(() => LikeResponse)
  async getLikeMembers(@Arg(`schedule_id`) schedule_id: string): Promise<LikeResponse> {
    try {
      const likes = await Like.find({
        join: {
          alias: 'like',
          leftJoinAndSelect: {
            member: 'like.member',
          },
        },
        where: { schedule_id },
      });

      return { likes };
    } catch (err) {
      return { error: { field: '', message: '' } };
    }
  }

  @Query(() => String)
  @UseMiddleware(hasAuth)
  async getLikeSchedules(@Ctx() { req, payload, error }: SchemaContext): Promise<String> {
    // 사용자 id로 해당 사용자가 좋아요 누른 게시물 가져오기

    if (error) return '';
    // 조인해서 스케줄 가져오기.

    const schedules = await Like.find({
      join: {
        alias: 'like',
        leftJoinAndSelect: {
          schedule: 'like.schedule',
        },
      },
      where: { member_id: payload!.id },
    });

    return 'test2';
  }

  // 좋아요
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async likeSchedule(
    @Arg(`schedule_id`) schedule_id: string,
    @Ctx() { req, payload, error }: SchemaContext
  ): Promise<Boolean> {
    if (error) return false;

    try {
      const member_id = payload!.id;

      await Like.create({ member_id, schedule_id }).save();
      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }

  // 좋아요 취소
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async unLikeSchedule(
    @Arg(`schedule_id`) schedule_id: string,
    @Ctx() { req, payload, error }: SchemaContext
  ): Promise<Boolean> {
    if (error) return false;

    try {
      const member_id = payload!.id;

      await Like.delete({ member_id, schedule_id });
      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }
}
