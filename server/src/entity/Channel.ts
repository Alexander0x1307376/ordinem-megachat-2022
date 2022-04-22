import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";
import { Group } from "./Group";

@Entity('channels')
export class Channel extends Model {

  @Column({ length: 64 })
  name: string;

  @Column({ length: 256, nullable: true })
  description: string;

  @Column()
  groupId: number;
  @ManyToOne(() => Group)
  group: Group;
}