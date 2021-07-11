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
import { TopicLatestRead } from "./TopicLatestRead";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true})
  imgUrl?: string;

  @Column('text', { array: true })
  pinnedTopics: string[];

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
    () => GroupLatestRead,
    groupLatestRead => groupLatestRead.user
  )
  groupsLatestRead: Promise<GroupLatestRead[]>;

  @OneToMany(
    () => TopicLatestRead,
    topicLatestRead => topicLatestRead.user
  )
  topicsLatestRead: Promise<TopicLatestRead[]>;

  @ManyToMany(() => Group)
  @JoinTable()
  joinedGroups: Promise<Group[]>;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
