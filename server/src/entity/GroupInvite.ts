import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";
import { Group } from "./Group";

@Entity('group_invites')
export class GroupInvite extends Model {

  @Column({ unique: true })
  linkId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false })
  inviterId: number;
  @ManyToOne(() => User)
  inviter: User;

  @Column({ nullable: false })
  groupId: number;
  @ManyToOne(() => Group)
  group: Group;
}