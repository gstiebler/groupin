import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectID,
} from "typeorm";

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  externalId: string;

  @Column({ nullable: true })
  notificationToken?: string;

  @Column({ nullable: true})
  imgUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
