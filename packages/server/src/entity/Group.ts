import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";
import { Image } from "./Image";

@Entity('groups')
export class Group extends Model {

  @Column({ length: 64, unique: true })
  name: string;

  @Column({ length: 256, nullable: true })
  description: string;

  @Column({ nullable: false })
  ownerId: number;
  @ManyToOne(() => User)
  owner: User;

  
  @Column({ nullable: true })
  avaId: number;

  @ManyToOne(() => Image, { nullable: true, onDelete: 'SET NULL' })
  ava: Image;

  @ManyToMany((type) => User)
  @JoinTable()
  members: User[]
}