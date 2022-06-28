import { Connection, DataSource } from "typeorm";
import { FriendRequest } from "../../src/entity/FriendRequest";
import { Image } from "../../src/entity/Image";
import { User } from "../../src/entity/User";
import { Group } from "../../src/entity/Group";
import { Channel } from "../../src/entity/Channel";
import { UserToken } from "../../src/entity/UserToken";
import { Message } from "../../src/entity/Message";
import { GroupInvite } from "../../src/entity/GroupInvite";
import { UserPostData } from "@ordinem-megachat-2022/shared";
import AppDataSource from "../dataSource";
import { makeUsersData } from "../factories/userFactory";
import { makeGroupsData } from "../factories/groupsFactory";
import { makeChannelsData } from "../factories/channelsFactory";
import { makeMessagesData } from "../factories/messagesFactory";
import { faker } from "@faker-js/faker";
import { random, sample } from "lodash";
import { v4 } from "uuid";

const startSeed = async () => {
  await AppDataSource.initialize();
  const messages: any[] = [];

  const users = await AppDataSource.getRepository(User).find({select: ['id']});
  const usersIds = users.map(({id}) => id);

  for(let i = 0; i < 1000; i++) {
    messages.push({
      uuid: v4(),
      text: faker.lorem.sentences(random(1, 7)),
      channelId: 1,
      authorId: sample(usersIds)
    });
  }

  // console.log(messages);

  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Message)
    .values(messages)
    .execute();
  
}

startSeed();