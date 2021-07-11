import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Group } from "./Group";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true})
  imgUrl?: string;

  @Column('text', { array: true })
  pinnedTopics: string[];

  @OneToMany(
    () => Group,
    group => group.creator
  )
  createdGroups: Promise<Group[]>;

  @ManyToMany(type => Group)
  @JoinTable()
  joinedGroups: Promise<Group[]>;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
