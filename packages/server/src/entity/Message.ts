import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";
import { Channel } from "./Channel";

@Entity('messages')
export class Message extends Model {

  @Column()
  text: string;

  @Column()
  channelId: number;
  @ManyToOne(() => User)
  channel: Channel;

  @Column()
  authorId: number;
  @ManyToOne(() => User)
  author: User;
}