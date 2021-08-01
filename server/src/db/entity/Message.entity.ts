import { Field, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Topic } from "./Topic.entity";
import { User } from "./User.entity";

@Entity()
@ObjectType()
export class Message {

  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  text: string;

  @ManyToOne(
    () => User,
    user => user.messages
  )
  user: Promise<User>;
  @Column({ nullable: false })
  userId: string;

  @ManyToOne(
    () => Topic,
    topic => topic.messages
  )
  topic: Promise<Topic>;
  @Column({ nullable: false })
  topicId: string;

  @CreateDateColumn()
  createdAt: Date;
}
