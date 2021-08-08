import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Member } from './Member';
import { Schedule } from './Schedule';

@ObjectType()
@Entity()
export class Like extends BaseEntity {
  @Field()
  @PrimaryColumn()
  member_id!: string;

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'member_id' })
  member?: Member;

  @Field()
  @PrimaryColumn()
  schedule_id!: string;

  @Field(() => Schedule)
  @ManyToOne(() => Schedule, (schedule) => schedule.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule?: Schedule;
}
