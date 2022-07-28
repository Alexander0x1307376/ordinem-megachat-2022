import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Model from "./Model";
import { Group } from "./Group";
import { ChatRoom } from "./ChatRoom";

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

  @Column()
  chatRoomId: number;
  @OneToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn()
  chatRoom: ChatRoom;
}