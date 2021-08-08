import { Resolver, Query, Arg, Mutation, InputType, Field, ObjectType, Ctx, UseMiddleware } from 'type-graphql';
import argon2 from 'argon2';
import { FieldError } from './FieldError';
import { SchemaContext } from '../types';
import { createAccessToken, hasAuth, logout, randomVersion, sendRefreshToken } from '../functions/auth';
import { verify } from 'jsonwebtoken';
import { getConnection, getRepository } from 'typeorm';
import { Follow } from '../entity/Follow';
import { Member } from '../entity/Member';
import Comment, { CommentResponse } from '../mongodb/models/Comment';
import { Tag } from '../entity/Tag';
import { Like } from '../entity/Like';
import ScheduleDetails from '../mongodb/models/ScheduleDetails';

@ObjectType()
class CommentRes extends CommentResponse {
  @Field(() => Member)
  member!: Member;
}

@ObjectType()
class CommentResponseType {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;

  @Field(() => CommentResponse, { nullable: true })
  comment?: CommentResponse;

  @Field(() => [CommentRes], { nullable: true })
  comments?: CommentRes[];
}

@Resolver()
export class CommentResolver {
  @Mutation(() => CommentResponseType)
  @UseMiddleware(hasAuth)
  async createComment(
    @Arg(`mongo_id`) mongo_id: string,
    @Arg(`description`) description: string,
    @Ctx() { req, payload, error }: SchemaContext
  ): Promise<CommentResponseType> {
    if (error) return { error: { field: '', message: '' } };

    try {
      const comment = await Comment.create({
        schedule_mongo_id: mongo_id,
        writer_id: payload!.id,
        description,
        created_at: Number(new Date()),
      });

      // comment_count + 1 해줘야함.
      const check = await ScheduleDetails.findOneAndUpdate({ _id: mongo_id }, { $inc: { comment_count: 1 } }).exec();
      // console.log(check);

      return { comment };
    } catch (err) {
      console.log(err);
      return { error: { field: '', message: '' } };
    }
  }

  @Query(() => CommentResponseType)
  async readComment(@Arg(`mongo_id`) mongo_id: string): Promise<CommentResponseType> {
    const comments = await Comment.find({ schedule_mongo_id: mongo_id }).sort('created_at').exec();
    const member_ids = comments.map((c) => ({ id: c.writer_id }));

    const members = await Member.find({ where: member_ids });

    const temp: (CommentRes | null)[] = comments.map((comment) => {
      const { _id, schedule_mongo_id, writer_id, description, created_at } = comment;
      const member = members.filter((m) => m.id === comment.writer_id);

      if (member.length === 0) return null;

      return { _id, schedule_mongo_id, writer_id, description, created_at, member: member[0] };
    });

    const final = temp.filter((t) => t !== null) as CommentRes[];

    return { comments: final };
  }
}
