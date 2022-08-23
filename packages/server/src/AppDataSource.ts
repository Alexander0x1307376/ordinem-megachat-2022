import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DataSource } from "typeorm";
import { Image } from "./entity/Image";
import { User } from "./entity/User";
import { Group } from "./entity/Group";
import { Channel } from "./entity/Channel";
import { UserToken } from "./entity/UserToken";
import { Message } from "./entity/Message";
import { GroupInvite } from "./entity/GroupInvite";
import { FriendRequest } from "./entity/FriendRequest";
import { ChatRoom } from "./entity/ChatRoom";
import { Conversation } from "./entity/Conversation";
import { DirectChat } from "./entity/DirectChat";
import { TYPES } from './injectableTypes';
import { IConfigService } from './features/config/IConfigService';


export type DBConnectionConfig = {
  host: string; 
  port: number; 
  databaseName: string; 
  userName: string; 
  password: string;
}


@injectable()
export class AppDataSource {

  dataSource: DataSource;

  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    const dataSource = new DataSource({
      type: "postgres",
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT')),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      synchronize: true,
      logging: false,
      entities: [
        User, UserToken, Image, Group, Channel, DirectChat,
        Message, GroupInvite, FriendRequest, ChatRoom, Conversation
      ],
      subscribers: [],
      migrations: [],
    });
    this.dataSource = dataSource;

    this.init = this.init.bind(this);
  }

  async init() {
    await this.dataSource.initialize();
  }
}