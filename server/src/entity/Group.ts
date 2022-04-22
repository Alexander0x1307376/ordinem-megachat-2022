import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";
import { Image } from "./Image";

@Entity('groups')
export class Group extends Model {

  @Column({ length: 64 })
  name: string;

  @Column({ length: 256, nullable: true })
  description: string;

  @ManyToOne(() => User)
  owner: User;

  
  @Column({ nullable: true })
  avaId: number;

  @ManyToOne(() => Image, { nullable: true })
  ava: Image;

  @ManyToMany((type) => User)
  @JoinTable()
  members: User[]
}