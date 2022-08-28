import { FriendRequestMessage } from '@ordinem-megachat-2022/shared';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';
import { AppDataSource } from '../../AppDataSource';
import { User } from '../../entity/User';
import { TYPES } from '../../injectableTypes';
import { configServiceMock } from '../../tests/mocks/configServiceMock';
import { IConfigService } from '../config/IConfigService';
import { FriendRequestService } from './FriendRequestService';
import { FriendshipSystemEventEmitter } from './FriendshipSystemEventEmitter';
import { IFriendRequestService } from './IFriendRequestService';

describe('манипуляции с данными групп', () => {

  const usersData = [
    { id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' },
    { id: 2, uuid: v4(), name: 'User 2', email: 'user2@test.dev', password: '1234' },
    { id: 3, uuid: v4(), name: 'User 3', email: 'user3@test.dev', password: '1234' },
    { id: 4, uuid: v4(), name: 'User 4', email: 'user4@test.dev', password: '1234' }
  ];


  const container = new Container({
    skipBaseClassChecks: true
  });
  let configService: IConfigService;
  let appDataSource: AppDataSource;
  let dataSource: DataSource;
  let requestService: IFriendRequestService;
  let friendshipEventEmitter: FriendshipSystemEventEmitter;

  beforeAll(async () => {

    friendshipEventEmitter = new FriendshipSystemEventEmitter();

    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
    container.bind<AppDataSource>(TYPES.DataSource).to(AppDataSource).inSingletonScope();
    container.bind<FriendshipSystemEventEmitter>(TYPES.FriendshipEventEmitter).toConstantValue(friendshipEventEmitter);
    container.bind<IFriendRequestService>(TYPES.FriendRequestService).to(FriendRequestService);

    configService = container.get<IConfigService>(TYPES.ConfigService);
    appDataSource = container.get<AppDataSource>(TYPES.DataSource);
    requestService = container.get<IFriendRequestService>(TYPES.FriendRequestService);
    
    await appDataSource.init();
    dataSource = appDataSource.dataSource;

    // создаём пользователей
    const users = await dataSource.createQueryBuilder(User, 'u')
      .insert()
      .values(usersData)
      .execute();

    // создаём дружескую связь между User 3 и User 4
    await dataSource.createQueryBuilder()
      .insert()
      .into('users_friends_users')
      .values({usersId_1: 3, usersId_2: 4})
      .execute();

  });

  afterAll(async () => {
    // сносим все созданные записи
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });



  test('запрос дружбы отправляется: успех', async () => {
    const requesterUser = usersData[0];
    const requestedUser = usersData[1];

    const requestResult = await requestService.createRequest(requesterUser.uuid, requestedUser.name);

    const expectedRequest: FriendRequestMessage = {
      data: {
        requested: {
          name: requestedUser.name,
          uuid: requestedUser.uuid
        },
        requester: {
          uuid: requesterUser.uuid
        }
      },
      status: 'success'
    };

    expect(requestResult).toEqual(expectedRequest);
  });



  test('запрос дружбы отправляется: получателя с таким ником нет', async () => {
    const requesterUser = usersData[0];
    const notExistingUserName = 'nonexist';

    const requestResult = await requestService.createRequest(requesterUser.uuid, notExistingUserName);

    const expectedRequest: FriendRequestMessage = {
      data: {
        requested: {
          name: 'nonexist',
        },
        requester: {
          uuid: requesterUser.uuid
        }
      },
      status: 'noRequestedUser'
    };

    expect(requestResult).toEqual(expectedRequest);
  });

  
  test('запрос дружбы отправляется: получатель - уже друг', async () => {
    
    const requesterUser = usersData[2];
    const requestedUser = usersData[3];

    const requestResult = await requestService.createRequest(requesterUser.uuid, requestedUser.name);

    const expectedRequest: FriendRequestMessage = {
      data: {
        requested: {
          name: requestedUser.name,
          uuid: requestedUser.uuid
        },
        requester: {
          uuid: requesterUser.uuid
        }
      },
      status: 'alreadyFriends'
    };

    expect(requestResult).toEqual(expectedRequest);
  });


  // test('запрос дружбы отзывается отправителем', async () => {
  //   // expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
  //   // expect(resultFromDb).toEqual(expectedResultFromDb);
  // });

  // test('запрос дружбы принимается получателем, проверяем связь', async () => {
  //   // expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
  //   // expect(resultFromDb).toEqual(expectedResultFromDb);
  // });

  // test('запрос дружбы отклоняется получателем', async () => {
  //   // expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
  //   // expect(resultFromDb).toEqual(expectedResultFromDb);
  // });

});