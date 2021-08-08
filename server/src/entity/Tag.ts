import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Schedule } from './Schedule';

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field()
  @PrimaryColumn()
  schedule_id!: string;

  @Field(() => Schedule)
  @ManyToOne(() => Schedule, (schedule) => schedule.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule?: Schedule;

  @Field()
  @PrimaryColumn()
  tag!: string;

  @Column()
  @Field()
  idx!: number;
}
