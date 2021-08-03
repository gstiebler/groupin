import { Column, Entity, ObjectID } from "typeorm";

@Entity()
export class TopicLatestRead {

  @Column({ nullable: false })
  userId: ObjectID;

  @Column({ nullable: false })
  topicId: ObjectID;

  @Column()
  latestMoment: Date;
}
