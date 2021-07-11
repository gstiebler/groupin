import { UpdateDateColumn, Entity, ManyToOne } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class GroupLatestRead {

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

  @UpdateDateColumn({ type: 'timestamp' })
  latestMoment: Date;
}
