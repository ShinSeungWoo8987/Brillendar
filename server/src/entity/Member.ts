import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Follow } from './Follow';
import { Schedule } from './Schedule';

@ObjectType()
@Entity()
export class Member extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({ defaultValue: false })
  @Column('boolean', { default: false })
  private!: boolean;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  phone!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profile_img?: string;

  @Column('int', { default: 0 })
  token_version!: number;

  @Field()
  @Column('int', { default: 0 })
  follower_count!: number;

  @Field(() => [Schedule])
  // 팔로잉 : 내가 남을 => 남을 구해야함. 남 = member_id
  @OneToMany(() => Schedule, (schedule) => schedule.writer, { cascade: true })
  schedules?: Schedule[];

  @Field(() => [Follow])
  // 팔로잉 : 내가 남을 => 남을 구해야함. 남 = member_id
  @OneToMany(() => Follow, (follow) => follow.member, { cascade: true })
  followings!: Follow[];

  @Field(() => [Follow])
  // 팔로워 : 남이 나를 => 남을 구해야함. 남 = target_id
  @OneToMany(() => Follow, (follow) => follow.target, { cascade: true })
  followers!: Follow[];

  // @CreateDateColumn
  // @UpdateDateColumn
}

// -- --------------------------------------------------------------------------
// 팔로우 카운트 트리거
// DELIMITER //
// CREATE TRIGGER follow_after_insert_trigger
//     AFTER INSERT ON `follow`
//     FOR EACH ROW
// BEGIN
//     IF NEW.relation = 2 THEN
//         UPDATE `member` SET follower_count = follower_count+1 WHERE id=NEW.target_id;
// 	END IF;
// END; //
// DELIMITER ;

// DELIMITER //
// CREATE TRIGGER follow_after_update_trigger
//     AFTER UPDATE ON `follow`
//     FOR EACH ROW
// BEGIN
//     IF NEW.relation = 2 THEN
//         UPDATE `member` SET follower_count = follower_count+1 WHERE id=NEW.target_id;
// 	END IF;
// END; //
// DELIMITER ;

// CREATE TRIGGER follow_after_delete_trigger
//     AFTER DELETE ON `follow`
//     FOR EACH ROW
// UPDATE `member` SET follower_count = follower_count-1 WHERE id=OLD.target_id;

// SHOW TRIGGERS;
// DROP TRIGGER IF EXISTS test2_after_delete_trigger;

// -- --------------------------------------------------------------------------
