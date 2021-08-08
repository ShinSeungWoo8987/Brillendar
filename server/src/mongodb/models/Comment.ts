import { Schema, model, Types } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CommentResponse {
  @Field(() => String)
  _id?: Types.ObjectId;
  @Field()
  schedule_mongo_id!: string;
  @Field()
  writer_id!: string;
  @Field()
  description!: string;
  @Field()
  created_at!: Date;
}

const schema = new Schema({
  schedule_mongo_id: { type: String, required: true },
  writer_id: { type: String, required: true },
  description: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export default model<CommentResponse>('Comment', schema);
