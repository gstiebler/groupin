/* eslint-disable no-unused-vars */
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany, ObjectIdColumn, ObjectID } from "typeorm";

enum Visibility {
  SECRET = 'SECRET',
  PUBLIC = 'PUBLIC',
}

registerEnumType(Visibility, {
  name: "Visibility",
});

@Entity()
@ObjectType()
export class Group {

  @ObjectIdColumn()
  @Field()
  id: ObjectID;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  friendlyId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imgUrl?: string;

  @Column()
  @Field()
  description?: string;

  @Column()
  @Field(() => Visibility)
  visibility: string;

  @Column({ nullable: false })
  createdById: ObjectID;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
