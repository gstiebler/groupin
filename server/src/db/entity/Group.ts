import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne } from "typeorm";
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
  visibility: string;

  @ManyToOne(
    () => User,
    user => user.joinedGroups
  )
  creator: Promise<User>; // ['SECRET', 'PUBLIC']

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
