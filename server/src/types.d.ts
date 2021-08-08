import { Request, Response } from 'express';
import { type } from 'os';
import { Field, ObjectType } from 'type-graphql';
import { Session, SessionData } from 'express-session';
import { Member } from './entity/mysql/Member';
import { Follow } from './entity/Follow';

type Error = { field: string; message: string };

type SchemaContext = {
  req: Request & { session: Session & Partial<SessionData> & { userId?: string; version: number } };
  res: Response;
  payload?: { id: string; username: string; version: number };
  error?: Error;
};

type RegisterResponse = {
  ok: boolean;
  error?: Error;
  id?: string;
};

type SendMessageResponse = {
  statudCode: string;
  errMessage?: string;
};

type EmailVerifyToken = { email: string; uuid: string };
