import { define } from 'typeorm-seeding';
import { User } from '../../src/entity/User';
import { faker } from '@faker-js/faker';
import AppDataSource from '../dataSource';
import { UserPostData } from '@ordinem-megachat-2022/shared';
import { v4 } from 'uuid';

export const makeUsersData = (count: number): UserPostData[] | {id: number, uuid: string} => {

  const result: any[] = [];
  for(let i = 0; i < count; i++) {
    result.push({
      id: i + 1,
      uuid: v4(),
      name: faker.unique(faker.internet.userName),
      email: faker.unique(faker.internet.email),
      password: '1234'
    });
  }
  return result;
}
