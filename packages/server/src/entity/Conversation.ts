import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import Model from "./Model";
import { ChatRoom } from "./ChatRoom";
import { User } from "./User";
import { Image } from "./Image";

@Entity('conversations')
export class Conversation extends Model {

  @Column({ length: 64 })
  name: string;

  @Column({ length: 256, nullable: true })
  description: string;

  @Column("simple-json")
  rules: {
    whiteList: string[];
    blackList: string[];
  }

  @ManyToOne(() => Image, { nullable: true, onDelete: 'SET NULL' })
  ava: Image;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column()
  chatRoomId: number;
  @OneToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn()
  chatRoom: ChatRoom;
}