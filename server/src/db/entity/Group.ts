import { Field, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { GroupLatestRead } from "./GroupLatestRead";
import { Topic } from "./Topic";
import { User } from "./User";
import { UserGroupPinned } from "./UserGroupPinned";

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
  @Field({ nullable: true })
  description: string;

  @Column()
  @Field()
  visibility: string; // ['SECRET', 'PUBLIC']

  @ManyToOne(
    () => User,
    user => user.joinedGroups
  )
  creator: Promise<User>;

  @OneToMany(
    () => Topic,
    topic => topic.group
  )
  topics: Promise<Topic[]>;

  @OneToMany(
    () => UserGroupPinned,
    user => user.group
  )
  users: Promise<UserGroupPinned[]>;

  @OneToMany(
    () => GroupLatestRead,
    groupLatestRead => groupLatestRead.group
  )
  usersLatestRead: Promise<GroupLatestRead[]>;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  @Field()
  updatedAt: Date;
}
