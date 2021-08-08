import { NextFunction, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { Member } from '../entity/Member';
import { EmailVerifyToken, SchemaContext } from '../types';
import { EMAIL_EXPIRATION } from './redisClient';

// 미들웨어로 쓰일 function
export const hasAuth: MiddlewareFn<SchemaContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) throw new Error('Invalid');

  try {
    const token = authorization?.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);

    // 토큰 정보를 담아서 전달
    context.payload = payload as any;
  } catch (error) {
    // throw new Error('Expired');
    context.error = { field: 'hasAuth', message: 'Invalid token' };
  }
  return next();
};

export const createAccessToken = (member: Member) =>
  sign({ id: member.id, username: member.username, version: member.token_version }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '3d',
  });

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
  });
};

export const logout = (res: Response) => {
  res.cookie('jid', '', {
    httpOnly: true,
    expires: new Date('1970.01.01'),
  });
};

export const randomVersion = () => Math.floor(Math.random() * 1000);

////////////////////////////////////////////////////////////////////////

export const createEmailVerifyToken = (payload: EmailVerifyToken) =>
  sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: EMAIL_EXPIRATION,
  });

export const getEmailVerifyToken = (token: string): EmailVerifyToken =>
  verify(token, process.env.ACCESS_TOKEN_SECRET!) as EmailVerifyToken;
