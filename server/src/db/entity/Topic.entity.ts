import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany, ObjectIdColumn, ObjectID } from "typeorm";
import { Group } from "./Group.entity";
import { Message } from "./Message.entity";
import { PinnedTopic } from "./PinnedTopic.entity";
import { TopicLatestRead } from "./TopicLatestRead.entity";
import { User } from "./User.entity";

@Entity()
@ObjectType()
export class Topic {

  @ObjectIdColumn()
  @Field()
  id: ObjectID;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field()
  imgUrl?: string;

  @Field()
  @Column({ nullable: false })
  groupId: ObjectID;

  @Column({ nullable: false })
  createdById: ObjectID;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
