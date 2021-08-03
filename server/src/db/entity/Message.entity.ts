import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
@ObjectType()
export class Message {

  @ObjectIdColumn()
  @Field()
  id: ObjectID;

  @Column()
  @Field()
  text: string;

  @Column({ nullable: false })
  userId: ObjectID;

  @Column({ nullable: false })
  topicId: ObjectID;

  @CreateDateColumn()
  createdAt: Date;
}
