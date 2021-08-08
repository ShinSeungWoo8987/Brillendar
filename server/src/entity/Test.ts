import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Test extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id!: string;

  @Field()
  @PrimaryColumn()
  test!: string;

  @Column()
  @Field()
  idx!: number;
}
