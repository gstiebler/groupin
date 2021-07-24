import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
} from "typeorm";
import { Group } from "./Group.entity";
import { Message } from "./Message.entity";
import { PinnedTopic } from "./PinnedTopic.entity";
import { Topic } from "./Topic.entity";
import { TopicLatestRead } from "./TopicLatestRead.entity";
import { UserGroup } from "./UserGroup.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  externalId: string;

  @Column()
  notificationToken: string;

  @Column({ nullable: true})
  imgUrl?: string;

  @OneToMany(
    () => Group,
    group => group.createdBy
  )
  createdGroups: Promise<Group[]>;

  @OneToMany(
    () => Message,
    message => message.user
  )
  messages: Promise<Message[]>;

  @OneToMany(
    () => UserGroup,
    joinedGroup => joinedGroup.user
  )
  joinedGroups: Promise<UserGroup[]>;

  @OneToMany(
    () => Topic,
    createdTopic => createdTopic.createdBy
  )
  createdTopics: Promise<Topic[]>;

  @OneToMany(
    () => PinnedTopic,
    pinnedTopic => pinnedTopic.user
  )
  pinnedTopics: Promise<PinnedTopic[]>;

  @OneToMany(
    () => TopicLatestRead,
    topicLatestRead => topicLatestRead.user
  )
  topicsLatestRead: Promise<TopicLatestRead[]>;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
