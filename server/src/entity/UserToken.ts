import { Entity, Column, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";


@Entity('user_tokens')
export class UserToken extends Model {

  @Column({ unique: true })
  refreshToken: string

  @ManyToOne(() => User, user => user.refreshTokens)
  user: User

  @Column()
  userId: number;
}