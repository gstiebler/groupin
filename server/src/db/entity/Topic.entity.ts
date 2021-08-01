import { Field, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { Group } from "./Group.entity";
import { Message } from "./Message.entity";
import { PinnedTopic } from "./PinnedTopic.entity";
import { TopicLatestRead } from "./TopicLatestRead.entity";
import { User } from "./User.entity";

@Entity()
@ObjectType()
export class Topic {

  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field()
  imgUrl?: string;

  @ManyToOne(
    () => Group,
    group => group.topics
  )
  group: Promise<Group>;

  @Field()
  @Column({ nullable: false })
  groupId: string;

  @OneToMany(
    () => Message,
    message => message.user
  )
  messages: Promise<Message[]>;

  @ManyToOne(
    () => User,
    user => user.createdTopics
  )
  createdBy: Promise<User>;
  @Column({ nullable: false })
  createdById: string;

  @OneToMany(
    () => PinnedTopic,
    pinnedTopic => pinnedTopic.topic
  )
  usersPinned: Promise<PinnedTopic[]>;

  @OneToMany(
    () => TopicLatestRead,
    topicLatestRead => topicLatestRead.topic
  )
  usersLatestRead: Promise<TopicLatestRead[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
