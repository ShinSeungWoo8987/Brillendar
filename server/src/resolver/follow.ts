import { Resolver, Query, Arg, Mutation, InputType, Field, ObjectType, Ctx, UseMiddleware } from 'type-graphql';
import argon2 from 'argon2';
import { FieldError } from './FieldError';
import { SchemaContext } from '../types';
import { createAccessToken, hasAuth, logout, randomVersion, sendRefreshToken } from '../functions/auth';
import { verify } from 'jsonwebtoken';
import { getRepository, Like } from 'typeorm';
import { Follow } from '../entity/Follow';
import { Member } from '../entity/Member';

@ObjectType()
class FollowerResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
  @Field(() => [Follow], { nullable: true })
  request?: Follow[];
}

@ObjectType()
class FollowerCntResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
  @Field(() => Number, { nullable: true })
  count?: number;
}

@Resolver()
export class FollowResolver {
  // 팔로우 요청
  @Mutation(() => Number)
  @UseMiddleware(hasAuth)
  async requestFollow(@Arg(`id`) id: string, @Ctx() { req, payload, error }: SchemaContext): Promise<-1 | 1 | 2> {
    if (error) return -1;

    try {
      const member_id = payload!.id;
      const target_id = id;

      const member = await Member.findOne({ id: target_id });
      if (!member) return -1;

      // 상대가 private계정이면, relation: 1
      // 상대가 open계정이면, relation: 2
      const relation = member.private ? 1 : 2;

      const follow = await Follow.create({ member_id, target_id, relation }).save();

      return relation;
    } catch (err: any) {
      console.log(err);
      return -1;
    }
  }

  // 팔로우 요청 취소
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async requestUnFollow(@Arg(`id`) id: string, @Ctx() { req, payload, error }: SchemaContext): Promise<Boolean> {
    if (error) return false;

    try {
      const member_id = payload!.id;
      const target_id = id;

      const follow = await Follow.delete({ member_id, target_id });

      // console.log(follow);

      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }

  // 팔로우 승인
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async acceptFollow(@Arg(`id`) id: string, @Ctx() { req, payload, error }: SchemaContext): Promise<Boolean> {
    if (error) return false;

    try {
      const member_id = id;
      const target_id = payload!.id;

      const follow = await Follow.update({ member_id, target_id }, { relation: 2 });

      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }

  // 팔로우 거절
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async rejectFollow(@Arg(`id`) id: string, @Ctx() { req, payload, error }: SchemaContext): Promise<Boolean> {
    if (error) return false;

    try {
      const member_id = id;
      const target_id = payload!.id;

      const follow = await Follow.update({ member_id, target_id }, { relation: 0 });

      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }
}

/*
  // // SELECT * FROM follow as f LEFT JOIN member as m on f.target_id = m.id where f.target_id = 'bf285af7-c6e6-4d92-b220-2141c82bdf54' and f.relation = 1;

      const followRequest = await getRepository(Follow)
        .createQueryBuilder('f')
        .leftJoin(Member, 'm', 'f.target_id = m.id')
        .select('*')
        .where('f.target_id = :target_id', { target_id: payload!.id })
        .andWhere(`f.relation = 1`)
        .getRawMany();
  */
