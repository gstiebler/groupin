import { UpdateDateColumn, Entity, ManyToOne } from "typeorm";
import { Topic } from "./Topic";
import { User } from "./User";

@Entity()
export class TopicLatestRead {

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

  @UpdateDateColumn({ type: 'timestamp' })
  latestMoment: Date;
}
