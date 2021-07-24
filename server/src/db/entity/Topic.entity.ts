import { Field, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { Group } from "./Group.entity";
import { Message } from "./Message.entity";
import { PinnedTopic } from "./PinnedTopic.entity";
import { TopicLatestRead } from "./TopicLatestRead.entity";

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
    () => Topic,
    topic => topic.group
  )
  group: Promise<Group>;

  @Field()
  groupId: string;

  @OneToMany(
    () => Message,
    message => message.user
  )
  messages: Promise<Message[]>;

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

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
