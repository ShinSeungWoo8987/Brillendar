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

@ObjectType()
@Entity()
export class Follow extends BaseEntity {
  @Field()
  @PrimaryColumn()
  member_id!: string;

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member?: Member;

  @Field()
  @PrimaryColumn()
  target_id!: string;

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_id' })
  target?: Member;

  @Field()
  @Column()
  relation!: number;
}
