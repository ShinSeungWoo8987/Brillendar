import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import { createConnection } from 'typeorm';
import mongoConnection from './mongoConnection';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolver/hello';
import { MemberResolver } from './resolver/member';
import { ScheduleResolver } from './resolver/schedule';
import { FollowResolver } from './resolver/follow';
import { LikeResolver } from './resolver/like';
import { CommentResolver } from './resolver/comment';
import { RegisterResolver } from './resolver/register';

import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import indexRouter from './routes/index';
import registerRouter from './routes/register';

dotenv.config();

const main = async () => {
  await createConnection().catch((error) => console.error(error));
  await mongoConnection().catch((error) => console.error(error));

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(compression());
  app.use(cookieParser());
  app.use(cors({ origin: '*', credentials: true })); // origin: ['http://59.14.116.202:19006', 'http://localhost:19006']

  app.use('/', indexRouter);
  app.use('/', registerRouter);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        MemberResolver,
        ScheduleResolver,
        FollowResolver,
        LikeResolver,
        CommentResolver,
        RegisterResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  // 최신버전에서는 이거 안쓰면 에러뜸 // "apollo-server-express": "^2.25.0" 로 다운그레이드했음
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false }); // '*'

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
  });
};

main().catch((err) => console.log(err));
