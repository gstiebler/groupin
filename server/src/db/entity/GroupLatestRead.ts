import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class GroupLatestRead {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.groupsLatestRead
  )
  user: Promise<User>;

  @ManyToOne(
    () => Group,
    group => group.usersLatestRead
  )
  group: Promise<Group>;

  groupId: string;

  @Column({ type: 'timestamp' })
  latestMoment: Date;
}
