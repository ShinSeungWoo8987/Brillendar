import { Schema, model, Types } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ScheduleImg {
  @Field()
  idx!: Number;

  @Field()
  url!: string;
}

@ObjectType()
export class ScheduleDetailsResponse {
  @Field(() => String)
  _id?: Types.ObjectId;
  @Field()
  title!: string;
  @Field()
  description!: string;
  @Field()
  comment_count?: number;

  @Field(() => [ScheduleImg])
  result_img?: ScheduleImg[];
  @Field()
  result_description?: string;
}

const scheduleImg = new Schema({
  idx: Number,
  url: String,
});

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  comment_count: { type: Number, default: 0 },

  result_img: { type: [scheduleImg] },
  result_description: String,
});

export default model<ScheduleDetailsResponse>('ScheduleDetails', schema);
