import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class UserGroupPinned {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.joinedGroups
  )
  user: Promise<User>;

  @ManyToOne(
    () => Group,
    group => group.users
  )
  group: Promise<Group>;

  @Column(() => Boolean)
  pinned: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
