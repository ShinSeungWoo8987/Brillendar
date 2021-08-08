import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, BaseEntity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Like } from './Like';
import { Member } from './Member';
import { Tag } from './Tag';

@ObjectType()
@Entity()
export class Schedule extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  writer_id!: string;

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'writer_id' })
  writer?: Member;

  @Field(() => [Tag])
  @OneToMany(() => Tag, (tag) => tag.schedule, { cascade: true })
  tags?: Tag[];

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.schedule, { cascade: true })
  likes?: Like[];

  /////////

  @Column()
  @Field()
  mongo_id!: string; // mongodb에 먼저 삽입 후 uid를 받아와 저장

  @Column()
  @Field()
  open!: boolean;

  @Column({ default: 0 })
  @Field()
  like_count!: number;

  @Field()
  @Column({ type: 'timestamp' })
  start_at!: Date;

  @Field()
  @Column({ type: 'timestamp' })
  finish_at!: Date;
}
