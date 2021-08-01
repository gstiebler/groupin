import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { Group } from "./Group.entity";
import { User } from "./User.entity";

@Entity()
export class UserGroup {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.joinedGroups
  )
  user: Promise<User>;
  @Column({ nullable: false })
  userId: string;

  @ManyToOne(
    () => Group,
    group => group.users
  )
  group: Promise<Group>;
  @Column({ nullable: false })
  groupId: string;

  @Column()
  pinned: boolean;

  @Column()
  latestRead: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
