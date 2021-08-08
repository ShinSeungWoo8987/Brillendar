import { Resolver, Query, Arg, Mutation, InputType, Field, ObjectType, Ctx, UseMiddleware } from 'type-graphql';
import argon2 from 'argon2';
import { FieldError } from './FieldError';
import { SchemaContext } from '../types';
import { createAccessToken, hasAuth, logout, randomVersion, sendRefreshToken } from '../functions/auth';
import { verify } from 'jsonwebtoken';
import { getRepository, Like } from 'typeorm';
import { Follow } from '../entity/Follow';
import { Member } from '../entity/Member';

@InputType()
class MemberInput {
  @Field()
  email!: string;
  @Field()
  password!: string;
  @Field()
  username!: string;
  @Field()
  phone!: string;
}

@InputType()
class LoginInput {
  @Field()
  email!: string;
  @Field()
  password!: string;
}

@ObjectType()
class MemberResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
  @Field(() => Member, { nullable: true })
  member?: Member;
  @Field(() => String, { nullable: true })
  accessToken?: string;
}

/* ----------------------------------------------------------------------- */
@Resolver()
export class MemberResolver {
  // 로그인
  @Mutation(() => MemberResponse)
  async login(@Arg('login') { email, password }: LoginInput): Promise<MemberResponse> {
    try {
      const member = await Member.findOne({ email });

      // const member = await Member.findOne({ where: { email } });

      if (!member) return { error: { field: 'login', message: 'Invalid' } };

      const valid = await argon2.verify(member.password, password);

      if (!valid) return { error: { field: 'login', message: 'Invalid' } };

      // access token
      return { accessToken: createAccessToken(member), member };
    } catch (err) {
      console.log(err);
      return { error: { field: 'login', message: 'Invalid' } };
    }
  }

  // 토큰으로 로그인사용자 데이터 조회
  @Query(() => MemberResponse)
  @UseMiddleware(hasAuth)
  async getUserDataAndFollow(@Ctx() { req, payload, error }: SchemaContext): Promise<MemberResponse> {
    // hasAuth에서 잘못된 토큰인 경우
    if (error) return { error };

    try {
      const member = await Member.findOne(
        { id: payload!.id },
        {
          relations: ['followers', 'followers.member', 'followings', 'followings.target'],
        }
      );

      if (!member) return { error: { field: 'refreshToken', message: 'Invalid' } };

      if (member?.token_version !== payload!.version)
        return { error: { field: 'refreshToken', message: 'Token Version Error' } };

      return { member };
    } catch (err) {
      console.log(err);
      return { error: { field: 'refreshToken', message: 'Error Occurred' } };
    }
  }

  // 검색
  @Query(() => [Member])
  async searchMember(@Arg('search') search: string): Promise<Member[]> {
    const member = await Member.find({ username: Like(`%${search}%`) });
    return member;
  }

  // Schedule Screen에서 데이터 가져오기
  @Query(() => MemberResponse)
  async getScheduleScreenData(@Arg('id') id: string): Promise<MemberResponse> {
    const member = await Member.findOne({ where: { id } });
    if (member) return { member };
    return { error: { field: 'getScheduleScreenData', message: 'User not found' } };
  }

  // 계정상태 공개/비공개 전환
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async changePrivateAccount(
    @Arg('isPrivateAccount') isPrivateAccount: boolean,
    @Ctx() { req, payload, error }: SchemaContext
  ): Promise<boolean> {
    if (error) return false;

    try {
      const member = await Member.update({ id: payload!.id }, { private: isPrivateAccount });
      // console.log(member);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // 팔로워 수
  @Query(() => Number)
  async getFollowerCount(@Arg('id') id: string): Promise<number> {
    try {
      const data = await getRepository(Member)
        .createQueryBuilder('member')
        .select('follower_count')
        .where('member.id = :id', { id })
        .getRawOne();

      // data.followerCnt가 0인경우에 client에서 apollo가 업데이트를 안함. 왜이러는거야?
      // 클라이언트에서 받아서 -1처리 해준뒤 사용함.
      return Number(data.follower_count) + 1;
    } catch (err) {
      return 0;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async updateProfileImg(@Arg('url') url: string, @Ctx() { req, payload, error }: SchemaContext): Promise<boolean> {
    if (error) return false;

    try {
      const member = await Member.update({ id: payload!.id }, { profile_img: url });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // 회원탈퇴
  @Mutation(() => Boolean)
  @UseMiddleware(hasAuth)
  async leaveMember(
    @Arg('password') password: string,
    @Ctx() { req, payload, error }: SchemaContext
  ): Promise<boolean> {
    if (error) false;

    try {
      const id = payload!.id;

      const member = await Member.findOne({ id });
      if (!member) return false;

      const valid = await argon2.verify(member.password, password);
      if (!valid) return false;

      // delete from member where id === id
      const deleteMember = await getRepository(Member)
        .createQueryBuilder('member')
        .delete()
        .where('member.id = :id', { id })
        .execute();

      // console.log(deleteMember.raw);
      // console.log(deleteMember.affected);

      return true;
    } catch (err) {
      // console.log(err);
      return false;
    }
  }

  /*

  // 회원목록
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find();
  }

  // id로 회원찾기
  @Query(() => User, { nullable: true })
  async user(@Arg('id') id: string): Promise<User | null | undefined> {
    if (id.length !== 24) return null;
    const user = await User.findOne({ where: { id: ObjectIdColumn(id) } });

    return user;
  }

  // 토큰버전 바꾸기
  @Mutation(() => Boolean)
  async expireToken(@Arg('id', () => String) id: string) {
    const newVersion = randomVersion();
    let exVersion = newVersion;

    try {
      let cnt = 0;

      // 바꾼 버전이 이전 버전과 같지 않도록
      while (newVersion === exVersion) {
        await getMongoRepository(User)
          .findOneAndUpdate({ id: ObjectIdColumn(id) }, { $set: { token_version: newVersion } })
          .then((res) => {
            if (res.ok !== 1) return false;
            exVersion = res.value.token_version;
          });
        cnt++;
        // 무한루프 방지
        if (cnt > 4) return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  */
}
