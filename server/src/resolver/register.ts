import { Resolver, Query, Arg, Mutation, InputType, Field, ObjectType, Ctx, UseMiddleware } from 'type-graphql';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import Joi from '@hapi/joi';
import { FieldError } from './FieldError';
import { SchemaContext, SendMessageResponse } from '../types';
import requestIp from 'request-ip';

import { createAccessToken, hasAuth, logout, randomVersion, sendRefreshToken } from '../functions/auth';
import { verify } from 'jsonwebtoken';
import { getRepository, Like } from 'typeorm';
import { Follow } from '../entity/Follow';
import { Member } from '../entity/Member';
import {
  checkVerifiedEmail,
  deleteEmail,
  deletePhone,
  setNewEmailStatus,
  setOrChangePhoneValidationStatus,
  verifyPhoneCode,
} from '../functions/redisClient';
import sendVerifyEmail from '../functions/nodemailer';
import { sendMessage } from '../functions/ncpSMS';

@InputType()
class RegisterInput {
  @Field()
  email!: string;
  @Field()
  password!: string;
  @Field()
  username!: string;
  @Field()
  phone!: string;
  @Field()
  code!: string;
}

@ObjectType()
class RegisterResponse {
  @Field(() => Boolean, { nullable: true })
  ok!: boolean;

  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
}

/* ----------------------------------------------------------------------- */
@Resolver()
export class RegisterResolver {
  @Mutation(() => RegisterResponse)
  async emailValidation(@Arg('email') email: string): Promise<RegisterResponse> {
    try {
      const member = await Member.find({ email });
      if (member.length !== 0) return { ok: false, error: { field: 'Send Email', message: 'Email already exist.' } };
    } catch (err) {
      return { ok: false, error: { field: 'Send Email', message: 'Database error' } };
    }

    // 이메일 검증
    const emailSchema = Joi.string().email({ minDomainSegments: 2 });
    const checkEmail = emailSchema.validate(email);

    if (checkEmail.error || checkEmail.errors) {
      return { ok: false, error: { field: 'Send Email', message: 'Invalid email.' } };
    } else {
      try {
        const uuid = uuidv4();
        await setNewEmailStatus(email, uuid);
        await sendVerifyEmail(email, uuid);
        return { ok: true };
      } catch (err) {
        console.error(err);
        await deleteEmail(email);
        return { ok: false, error: { field: 'Send Email', message: 'Cannot send email.' } };
      }
    }
  }

  @Mutation(() => RegisterResponse)
  async verifyEmail(@Arg('email') email: string): Promise<RegisterResponse> {
    if (email) {
      try {
        await checkVerifiedEmail(email);
        return { ok: true };
      } catch (err) {
        return { error: { field: 'Verify', message: 'unConfirmed email.' }, ok: false };
      }
    } else {
      return { error: { field: 'Verify', message: 'Invalid email.' }, ok: false };
    }
  }

  ////////////////////////////////////
  @Mutation(() => RegisterResponse)
  async phoneValidation(
    @Arg('phone') phone: string,
    @Ctx() { req, payload, error }: SchemaContext
  ): Promise<RegisterResponse> {
    const member = await Member.find({ phone });
    if (member.length !== 0) return { ok: false, error: { field: 'Send message', message: 'Phone already exist.' } };

    const ip = requestIp.getClientIp(req);

    const sendResponse = ({ statudCode, errMessage }: SendMessageResponse): RegisterResponse => {
      if (statudCode === '202') return { ok: true };
      else return { ok: false, error: { field: `Send message ${statudCode}`, message: errMessage! } };
    };

    if (ip && phone && phone.length === 11) {
      const phoneStatus = await setOrChangePhoneValidationStatus(ip);
      // 0: 메세지 보내기, 1: 시도 횟수 초과
      if (phoneStatus === 1) {
        return { error: { field: 'Send message 429', message: 'Too Many Requests.' }, ok: false };
      } else {
        const message = await sendMessage(phone);
        return sendResponse(message);
      }
    } else {
      return { error: { field: 'Phone number', message: 'Invalid phone number.' }, ok: false };
    }
  }
  ////////////////////////////////////
  @Mutation(() => RegisterResponse)
  async verifyPhone(@Arg('phone') phone: string, @Arg('code') code: string): Promise<RegisterResponse> {
    if (code && phone) {
      try {
        return await verifyPhoneCode(phone, code);
      } catch (err) {
        return { error: { field: 'Verify', message: 'Server error' }, ok: false };
      }
    } else {
      return { error: { field: 'Verify', message: 'Invalid verify code.' }, ok: false };
    }
  }

  // username 중복체크
  @Query(() => RegisterResponse)
  async availableUsername(@Arg('username') username: string): Promise<RegisterResponse> {
    const member = await Member.find({ username });
    if (member.length !== 0) return { ok: false, error: { field: 'username', message: 'already exist.' } };
    else return { ok: true };
  }

  // 회원가입
  @Mutation(() => RegisterResponse)
  async createMember(
    @Arg('register') { email, password, username, phone, code }: RegisterInput
  ): Promise<RegisterResponse> {
    // console.log(email, password, username, phone, code);

    const pattern = /[^a-z0-9_]/g;
    if (pattern.test(username))
      return { ok: false, error: { field: 'username', message: 'Wrong regular expression.' } };

    // 이메일 검증
    const emailSchema = Joi.string().email({ minDomainSegments: 2 });
    const checkEmail = emailSchema.validate(email);

    if (checkEmail.error || checkEmail.errors)
      return { ok: false, error: { field: 'email', message: 'Invalid email.' } };

    if (email.length < 6) return { ok: false, error: { field: 'email', message: 'length' } };

    if (phone.length !== 11) return { ok: false, error: { field: 'phone', message: 'length' } };

    if (password.length < 8) return { ok: false, error: { field: 'password', message: 'length' } };

    const hashedPassword = await argon2.hash(password);
    ////////////////////////////////////
    try {
      // 인증된 메일인지 확인
      await checkVerifiedEmail(email);

      // 폰이랑 인증번호 다시 확인
      const { ok } = await verifyPhoneCode(phone, code);

      // 비밀번호 형식 체크 추가하기
      if (ok === true) {
        // db insert
        try {
          const member = new Member();
          member.email = email;
          member.password = hashedPassword;
          member.username = username!;
          member.phone = phone!;
          member.token_version = randomVersion();
          await Member.save(member);
        } catch (err: any) {
          // 에러코드 찍어보면, 뭐가 중복된건지 더 정확히 알 수 있음.
          // console.log(err.code, err.errno, err.sqlMessage, err.sqlState);
          return { ok: false, error: { field: 'Register', message: 'already exist' } };
        }

        // redis에서 삭제하기
        await deleteEmail(email);
        await deletePhone(phone);

        return { ok: true };
      } else {
        return { error: { field: 'Server', message: 'Cannot insert Database.' }, ok: false };
      }
    } catch (err) {
      // console.log(err);
      return { error: { field: 'Verify', message: 'Unconfirmed phone or email.' }, ok: false };
    }
  }
  ////////////////////////////////////
}
