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
  @Column({ nullable: false })
  userId: string;

  @ManyToOne(
    () => Topic,
    topic => topic.usersLatestRead
  )
  topic: Promise<Topic>;
  @Column({ nullable: false })
  topicId: string;

  @Column()
  latestMoment: Date;
}
