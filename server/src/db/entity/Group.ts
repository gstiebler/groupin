import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { GroupLatestRead } from "./GroupLatestRead";
import { Topic } from "./Topic";
import { User } from "./User";

@Entity()
export class Group {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  friendlyId: string;

  @Column({ nullable: true })
  imgUrl?: string;

  @Column()
  description: string;

  @Column()
  visibility: string; // ['SECRET', 'PUBLIC']

  @ManyToOne(
    () => User,
    user => user.joinedGroups
  )
  creator: Promise<User>;

  @OneToMany(
    () => Topic,
    topic => topic.group
  )
  topics: Promise<Topic[]>;

  @OneToMany(
    () => GroupLatestRead,
    groupLatestRead => groupLatestRead.group
  )
  usersLatestRead: Promise<GroupLatestRead[]>;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
