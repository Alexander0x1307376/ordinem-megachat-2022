import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";

@Entity('friend_requests')
export class FriendRequest extends Model {

  @Column({ nullable: false })
  requesterId: number;
  @ManyToOne(() => User)
  requester: User;

  @Column({ nullable: false })
  requestedId: number;
  @ManyToOne(() => User)
  requested: User;

}