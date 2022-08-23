import { FriendRequestMessage } from '@ordinem-megachat-2022/shared';
import { omit } from 'lodash';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';
import { Channel } from '../../entity/Channel';
import { ChatRoom } from '../../entity/ChatRoom';
import { FriendRequest } from '../../entity/FriendRequest';
import { Group } from '../../entity/Group';
import { GroupInvite } from '../../entity/GroupInvite';
import { Image } from '../../entity/Image';
import { Message } from '../../entity/Message';
import { User } from '../../entity/User';
import { UserToken } from '../../entity/UserToken';

// describe('манипуляции с данными групп', () => {

//   const AppDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5442,
//     username: "postgres",
//     password: "secret",
//     database: "ordinem_megachat",
//     synchronize: true,
//     logging: false,
//     entities: [
//       User, UserToken, Image, Group, Channel,
//       Message, GroupInvite, FriendRequest, ChatRoom
//     ],
//     subscribers: [],
//     migrations: [],
//   });

//   const usersData = [
//     { id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' },
//     { id: 2, uuid: v4(), name: 'User 2', email: 'user2@test.dev', password: '1234' },
//     { id: 3, uuid: v4(), name: 'User 3', email: 'user3@test.dev', password: '1234' },
//     { id: 4, uuid: v4(), name: 'User 4', email: 'user4@test.dev', password: '1234' }
//   ];

//   const requestService = createFriendRequestService({
//     dataSource: AppDataSource
//   });

//   beforeAll(async () => {

//     await AppDataSource.initialize();

//     // создаём пользователей
//     const users = await AppDataSource.createQueryBuilder(User, 'u')
//       .insert()
//       .values(usersData)
//       .execute();

//     // создаём дружескую связь между User 3 и User 4
//     await AppDataSource.createQueryBuilder()
//       .insert()
//       .into('users_friends_users')
//       .values({usersId_1: 3, usersId_2: 4})
//       .execute();

//   });

//   afterAll(async () => {
//     // сносим все созданные записи
//     await AppDataSource.dropDatabase();
//     await AppDataSource.destroy();
//   });



//   test('запрос дружбы отправляется: успех', async () => {
//     const requesterUser = usersData[0];
//     const requestedUser = usersData[1];

//     const requestResult = await requestService.createRequest(requesterUser.uuid, requestedUser.name);

//     const expectedRequest: FriendRequestMessage = {
//       data: {
//         requested: {
//           name: requestedUser.name,
//           uuid: requestedUser.uuid
//         },
//         requester: {
//           uuid: requesterUser.uuid
//         }
//       },
//       status: 'success'
//     };

//     expect(requestResult).toEqual(expectedRequest);
//   });



//   test('запрос дружбы отправляется. получателя с таким ником нет', async () => {
//     const requesterUser = usersData[0];
//     const notExistingUserName = 'nonexist';

//     const requestResult = await requestService.createRequest(requesterUser.uuid, notExistingUserName);

//     const expectedRequest: FriendRequestMessage = {
//       data: {
//         requested: {
//           name: 'nonexist',
//         },
//         requester: {
//           uuid: requesterUser.uuid
//         }
//       },
//       status: 'noRequestedUser'
//     };

//     expect(requestResult).toEqual(expectedRequest);
//   });

  
//   test('запрос дружбы отправляется. получатель - уже друг', async () => {
    
//     const requesterUser = usersData[2];
//     const requestedUser = usersData[3];

//     const requestResult = await requestService.createRequest(requesterUser.uuid, requestedUser.name);

//     const expectedRequest: FriendRequestMessage = {
//       data: {
//         requested: {
//           name: requestedUser.name,
//           uuid: requestedUser.uuid
//         },
//         requester: {
//           uuid: requesterUser.uuid
//         }
//       },
//       status: 'alreadyFriends'
//     };

//     expect(requestResult).toEqual(expectedRequest);
//   });


//   // test('запрос дружбы отзывается отправителем', async () => {
//   //   // expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
//   //   // expect(resultFromDb).toEqual(expectedResultFromDb);
//   // });

//   // test('запрос дружбы принимается получателем, проверяем связь', async () => {
//   //   // expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
//   //   // expect(resultFromDb).toEqual(expectedResultFromDb);
//   // });

//   // test('запрос дружбы отклоняется получателем', async () => {
//   //   // expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
//   //   // expect(resultFromDb).toEqual(expectedResultFromDb);
//   // });

// });