import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from "typeorm";
import Model from "./Model";
import { ChatRoom } from "./ChatRoom";
import { User } from "./User";

@Entity('direct_chats')
@Unique('users_direct_chat_unique', ['user1', 'user2'])
export class DirectChat extends Model {

  @Column()
  user1Id: number;
  @ManyToOne(() => User, { nullable: false })
  user1: User;

  @Column()
  user2Id: number;
  @ManyToOne(() => User, { nullable: false })
  user2: User;

  @Column()
  chatRoomId: number;
  @OneToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn()
  chatRoom: ChatRoom;
}