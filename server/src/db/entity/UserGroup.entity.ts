import { Column, CreateDateColumn, Entity, UpdateDateColumn, ObjectIdColumn, ObjectID } from "typeorm";

@Entity()
export class UserGroup {

  @ObjectIdColumn()
  id: ObjectID;

  @Column({ nullable: false })
  userId: ObjectID;

  @Column({ nullable: false })
  groupId: ObjectID;

  @Column()
  pinned: boolean;

  @Column()
  latestRead: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
