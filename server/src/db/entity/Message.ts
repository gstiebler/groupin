import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Topic } from "./Topic";
import { User } from "./User";

@Entity()
export class Message {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(
    () => User,
    user => user.messages
  )
  user: Promise<User>;

  userId: string;

  @ManyToOne(
    () => Topic,
    topic => topic.messages
  )
  topic: Promise<Topic>;

  topicId: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;
}
