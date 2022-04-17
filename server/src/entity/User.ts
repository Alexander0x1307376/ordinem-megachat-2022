import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";
import Model from "./Model";
import { UserToken } from "./UserToken";
import { genSalt, hash } from 'bcrypt';

@Entity('users')
export class User extends Model {

  @Column({ length: 40, unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 128 })
  password: string;

  @OneToMany(() => UserToken, refreshToken => refreshToken.user)
  refreshTokens: UserToken;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await genSalt();
    this.password = await hash(password || this.password, salt);
  }
}