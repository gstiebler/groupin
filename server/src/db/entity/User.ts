import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Group } from "./Group";
import { GroupLatestRead } from "./GroupLatestRead";
import { Message } from "./Message";
import { Topic } from "./Topic";
import { TopicLatestRead } from "./TopicLatestRead";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  externalId: string;

  @Column()
  name: string;

  @Column({ nullable: true})
  imgUrl?: string;

  @ManyToMany(() => Topic)
  @JoinTable()
  pinnedTopics: Promise<Topic[]>;

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

  @ManyToMany(() => Group)
  @JoinTable()
  joinedGroups: Promise<Group[]>;

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
