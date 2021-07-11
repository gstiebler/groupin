import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Topic } from "./Topic";
import { User } from "./User";

@Entity()
export class TopicLatestRead {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.topicsLatestRead
  )
  user: Promise<User>;

  @ManyToOne(
    () => Topic,
    topic => topic.usersLatestRead
  )
  topic: Promise<Topic>;

  @Column({ type: 'timestamp' })
  latestMoment: Date;
}
