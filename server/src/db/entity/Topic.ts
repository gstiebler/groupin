import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { Group } from "./Group";
import { Message } from "./Message";
import { PinnedTopic } from "./PinnedTopic";
import { TopicLatestRead } from "./TopicLatestRead";

@Entity()
export class Topic {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imgUrl?: string;

  @ManyToOne(
    () => Topic,
    topic => topic.group
  )
  group: Promise<Group>;

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
