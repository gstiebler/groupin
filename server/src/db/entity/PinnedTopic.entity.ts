import { CreateDateColumn, Entity, UpdateDateColumn, Column, ObjectIdColumn, ObjectID } from "typeorm";

@Entity()
export class PinnedTopic {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ nullable: false })
  userId: ObjectID;

  @Column({ nullable: false })
  topicId: ObjectID;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
