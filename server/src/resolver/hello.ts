import { Resolver, Query, UseMiddleware, Ctx, Arg } from 'type-graphql';
import { ObjectIdColumn } from 'typeorm';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  async hello() {
    return `Hello`;
  }
}
