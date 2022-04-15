import { DataSource } from "typeorm";
import { Image } from "./entity/Image";
import { User } from "./entity/User";
import { UserToken } from "./entity/UserToken";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "ordinem",
  password: "secret",
  database: "ordinem_megachat",
  synchronize: true,
  logging: true,
  entities: [User, UserToken, Image],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;