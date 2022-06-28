import { DataSource, DataSourceOptions } from "typeorm";
import { FriendRequest } from "../src/entity/FriendRequest";
import { Image } from "../src/entity/Image";
import { User } from "../src/entity/User";
import { Group } from "../src/entity/Group";
import { Channel } from "../src/entity/Channel";
import { UserToken } from "../src/entity/UserToken";
import { Message } from "../src/entity/Message";
import { GroupInvite } from "../src/entity/GroupInvite";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "ordinem",
  password: "secret",
  database: "ordinem_megachat",
  synchronize: true,
  logging: false,
  entities: [User, UserToken, Image, Group, Channel, Message, GroupInvite, FriendRequest],
  subscribers: [],
  migrations: []
});

export default AppDataSource;