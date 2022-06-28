import { faker } from '@faker-js/faker';
import { ChannelPostData } from '@ordinem-megachat-2022/shared';
import { v4 } from 'uuid';

export const makeChannelsData = (count: number): ChannelPostData[] | { id: number, uuid: string } => {

  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    result.push({
      id: i + 1,
      uuid: v4(),
      name: faker.unique(faker.internet.userName),
      description: faker.lorem.sentence(),
    });
  }
  return result;
}