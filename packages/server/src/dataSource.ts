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

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "ordinem",
  password: "secret",
  database: "ordinem_megachat",
  synchronize: true,
  logging: false,
  entities: [
    User, UserToken, Image, Group, Channel, 
    Message, GroupInvite, FriendRequest, ChatRoom, Conversation
  ],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;