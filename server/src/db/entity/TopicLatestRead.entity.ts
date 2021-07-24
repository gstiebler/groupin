import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Topic } from "./Topic.entity";
import { User } from "./User.entity";

@Entity()
export class TopicLatestRead {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.topicsLatestRead
  )
  user: Promise<User>;
  userId: string;

  @ManyToOne(
    () => Topic,
    topic => topic.usersLatestRead
  )
  topic: Promise<Topic>;
  topicId: string;

  @Column({ type: 'timestamp' })
  latestMoment: Date;
}
