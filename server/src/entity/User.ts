import { Entity, Column, OneToMany, BeforeInsert, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import Model from "./Model";
import { UserToken } from "./UserToken";
import { genSalt, hash } from 'bcrypt';
import { Image } from "./Image";

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

  @Column({nullable: true})
  avaId: number;
  
  @ManyToOne(() => Image, {nullable: true})
  ava: Image;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
  
  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await genSalt();
    this.password = await hash(password || this.password, salt);
  }
}