import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  RECALLED = 'recalled'
}

@Entity('friend_requests')
export class FriendRequest extends Model {

  @Column({ unique: true })
  linkId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false })
  requesterId: number;
  @ManyToOne(() => User)
  requester: User;

  @Column({ nullable: false })
  requestedId: number;
  @ManyToOne(() => User)
  requested: User;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING
  })
  status: FriendRequestStatus

}