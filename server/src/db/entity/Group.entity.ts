/* eslint-disable no-unused-vars */
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { Topic } from "./Topic.entity";
import { User } from "./User.entity";
import { UserGroup } from "./UserGroup.entity";

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

  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

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

  @ManyToOne(
    () => User,
    user => user.joinedGroups
  )
  createdBy: Promise<User>;
  @Column({ nullable: false })
  createdById: string;

  @OneToMany(
    () => Topic,
    topic => topic.group
  )
  topics: Promise<Topic[]>;

  @OneToMany(
    () => UserGroup,
    user => user.group
  )
  users: Promise<UserGroup[]>;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
