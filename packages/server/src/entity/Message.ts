import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";
import { ChatRoom } from "./ChatRoom";

@Entity('messages')
export class Message extends Model {

  @Column()
  text: string;

  @Column()
  chatRoomId: number;
  @ManyToOne(() => ChatRoom, {onDelete: "CASCADE"})
  chatRoom: ChatRoom;

  @Column()
  authorId: number;
  @ManyToOne(() => User)
  author: User;
}