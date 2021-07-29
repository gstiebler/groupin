import { PrimaryGeneratedColumn, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn, Column } from "typeorm";
import { Topic } from "./Topic.entity";
import { User } from "./User.entity";

@Entity()
export class PinnedTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.pinnedTopics
  )
  user: Promise<User>;
  @Column({ nullable: false })
  userId: string;

  @ManyToOne(
    () => Topic,
    topic => topic.usersPinned
  )
  topic: Promise<Topic>;
  @Column({ nullable: false })
  topicId: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
