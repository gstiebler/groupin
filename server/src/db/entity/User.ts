import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
} from "typeorm";
import { Group } from "./Group";
import { GroupLatestRead } from "./GroupLatestRead";
import { Message } from "./Message";
import { TopicLatestRead } from "./TopicLatestRead";
import { UserGroupPinned } from "./UserGroupPinned";

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
    group => group.creator
  )
  createdGroups: Promise<Group[]>;

  @OneToMany(
    () => Message,
    message => message.user
  )
  messages: Promise<Message[]>;

  @OneToMany(
    () => UserGroupPinned,
    joinedGroup => joinedGroup.user
  )
  joinedGroups: Promise<UserGroupPinned[]>;

  @OneToMany(
    () => GroupLatestRead,
    groupLatestRead => groupLatestRead.user
  )
  groupsLatestRead: Promise<GroupLatestRead[]>;

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
