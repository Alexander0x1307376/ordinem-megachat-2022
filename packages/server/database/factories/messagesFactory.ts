import { faker } from '@faker-js/faker';
// import {  } from '@ordinem-megachat-2022/shared';
import { v4 } from 'uuid';
import {random} from 'lodash';

export const makeMessagesData = (count: number): any[] | { id: number, uuid: string } => {

  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    result.push({
      id: i + 1,
      uuid: v4(),
      name: faker.unique(faker.internet.userName),
      text: faker.lorem.sentence(random(1, 8)),
    });
  }
  return result;
}