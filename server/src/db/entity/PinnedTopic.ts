import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { Topic } from "./Topic";
import { User } from "./User";

@Entity()
export class PinnedTopic {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.pinnedTopics
  )
  user: Promise<User>;
  userId: string;

  @ManyToOne(
    () => Topic,
    topic => topic.usersPinned
  )
  topic: Promise<Topic>;
  topicId: string;

  @Column(() => Boolean)
  pinned: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
