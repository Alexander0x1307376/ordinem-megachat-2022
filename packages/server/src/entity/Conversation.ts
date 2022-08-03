import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Model from "./Model";
import { ChatRoom } from "./ChatRoom";
import { User } from "./User";
import { Image } from "./Image";

@Entity('conversations')
export class Conversation extends Model {

  @Column({ length: 64, nullable: true })
  name: string;

  @Column({ length: 256, nullable: true })
  description: string;

  @Column("simple-json")
  rules: {
    whiteList: string[];
    blackList: string[];
  }

  @Column({ nullable: true })
  avaId: number;
  @ManyToOne(() => Image, { nullable: true, onDelete: 'SET NULL' })
  ava: Image;


  @Column({ nullable: false })
  ownerId: number;
  @ManyToOne(() => User)
  owner: User;


  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column()
  chatRoomId: number;
  @OneToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn()
  chatRoom: ChatRoom;
}