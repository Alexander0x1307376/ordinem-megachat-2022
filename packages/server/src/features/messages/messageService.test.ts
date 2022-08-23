import { assert } from 'console';
import { decode, encode } from 'js-base64';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';
import { Channel } from '../../entity/Channel';
import { FriendRequest } from '../../entity/FriendRequest';
import { Group } from '../../entity/Group';
import { GroupInvite } from '../../entity/GroupInvite';
import { Image } from '../../entity/Image';
import { Message } from '../../entity/Message';
import { User } from '../../entity/User';
import { UserToken } from '../../entity/UserToken';
// import createMessageService from './messageService';
import { omit, mapValues, pick } from 'lodash';
import { ChatRoom } from '../../entity/ChatRoom';
import { MessageItemResponse, MessagePostData, MessageSet } from '@ordinem-megachat-2022/shared';


// describe('набор сообщений извлекается согласно курсору', () => {
  
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


//   const messageService = createMessageService({
//     dataSource: AppDataSource
//   });

//   const usersData = [
//     { id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' },
//     { id: 2, uuid: v4(), name: 'User 2', email: 'user2@test.dev', password: '1234' },
//     { id: 3, uuid: v4(), name: 'User 3', email: 'user3@test.dev', password: '1234' },
//   ];

//   const groupData = { 
//     id: 1, uuid: v4(), name: 'Тестовая группа User 1', description: 'Это тестовая группа', ownerId: 1 
//   };


//   const chatRoomData = { id: 1, uuid: v4() };
//   const channelData = { id: 1, uuid: v4(), name: 'Тестовый канал', groupId: 1, chatRoomId: 1 };


//   const messagesData = [
//     { id: 1, uuid: v4(), text: 'Тестовое сообщение №1', authorId: 1, chatRoomId: 1 }, // 0
//     { id: 2, uuid: v4(), text: 'Тестовое сообщение №2', authorId: 2, chatRoomId: 1 }, // 1
//     { id: 3, uuid: v4(), text: 'Тестовое сообщение №3', authorId: 3, chatRoomId: 1 }, // 2
//     { id: 4, uuid: v4(), text: 'Тестовое сообщение №4', authorId: 1, chatRoomId: 1 }, // 3
//     { id: 5, uuid: v4(), text: 'Тестовое сообщение №5', authorId: 2, chatRoomId: 1 }, // 4
//     { id: 6, uuid: v4(), text: 'Тестовое сообщение №6', authorId: 3, chatRoomId: 1 }, // 5
//     { id: 7, uuid: v4(), text: 'Тестовое сообщение №7', authorId: 1, chatRoomId: 1 }, // 6
//     { id: 8, uuid: v4(), text: 'Тестовое сообщение №8', authorId: 2, chatRoomId: 1 }, // 7
//     { id: 9, uuid: v4(), text: 'Тестовое сообщение №9', authorId: 3, chatRoomId: 1 }  // 8
//   ];

//   beforeAll(async () => {

//     await AppDataSource.initialize();
    
//     // создаём пользователей
//     const usersResult = await AppDataSource.createQueryBuilder(User, 'u')
//       .insert()
//       .values(usersData)
//       .execute();

//     // создаём группу
//     const group = await AppDataSource.createQueryBuilder(Group, 'g')
//       .insert()
//       .values([groupData])
//       .execute();

    
//     const chatRoom = await AppDataSource.createQueryBuilder()
//       .insert()
//       .into('chatrooms')
//       .values([chatRoomData])
//       .execute();

//     // создаём канал
//     const channel = await AppDataSource.createQueryBuilder(Channel, 'c')
//       .insert()
//       .values([channelData])
//       .execute();

//     // нагружаем канал сообщениями
//     const messages = await AppDataSource.createQueryBuilder(Message, 'm')
//       .insert()
//       .values(messagesData)
//       .execute();
//   });

//   afterAll(async () => {
//     // сносим все созданные записи
//     await AppDataSource.dropDatabase();
//     await AppDataSource.destroy();
//   });




//   test('запрос набора из начала по prev курсору', async () => {

//     const cursorData = { value: messagesData[4].uuid, type: 'prev' };
//     const encodedCursor = encode(JSON.stringify(cursorData));
    
//     const assertingData = {
//       messages: {
//         [messagesData[0].uuid]: { 
//           id: 1, uuid: messagesData[0].uuid, text: 'Тестовое сообщение №1', 
//         }, 
//         [messagesData[1].uuid]: { 
//           id: 2, uuid: messagesData[1].uuid, text: 'Тестовое сообщение №2' 
//         }, 
//         [messagesData[2].uuid]: { 
//           id: 3, uuid: messagesData[2].uuid, text: 'Тестовое сообщение №3' 
//         }, 
//         [messagesData[3].uuid]: { 
//           id: 4, uuid: messagesData[3].uuid, text: 'Тестовое сообщение №4' 
//         }, 
//       },
//       chatRoomUuid: chatRoomData.uuid,
//       cursors: {
//         next: encode(JSON.stringify({
//           value: messagesData[3].uuid,
//           type: 'next'
//         }))
//       }
//     };

//     const data = await messageService.getMessagesOfRoom(chatRoomData.uuid, encodedCursor, 10);
//     const omittedData = {
//       ...data,
//       messages: Object.keys(data.messages).reduce((acc, item) => {
//         return Object.assign(acc, {
//           [item]: pick(data.messages[item], [
//             'id', 'uuid', 'text'
//           ])
//         })
//       }, {})
//     }

//     expect(omittedData).toEqual(assertingData);
//   });




//   test('запрос набора из конца по next курсору', async () => {
    
//     const cursorData = { value: messagesData[5].uuid, type: 'next' };
//     const encodedCursor = encode(JSON.stringify(cursorData));

//     const assertingData = {
//       messages: {
//         [messagesData[6].uuid]: {
//           id: 7, uuid: messagesData[6].uuid, text: 'Тестовое сообщение №7'
//         },
//         [messagesData[7].uuid]: {
//           id: 8, uuid: messagesData[7].uuid, text: 'Тестовое сообщение №8'
//         },
//         [messagesData[8].uuid]: {
//           id: 9, uuid: messagesData[8].uuid, text: 'Тестовое сообщение №9'
//         }
//       },
//       chatRoomUuid: chatRoomData.uuid,
//       cursors: {
//         prev: encode(JSON.stringify({
//           value: messagesData[6].uuid,
//           type: 'prev'
//         }))
//       }
//     };

//     const data = await messageService.getMessagesOfRoom(chatRoomData.uuid, encodedCursor, 10);
//     const omittedData = {
//       ...data,
//       messages: Object.keys(data.messages).reduce((acc, item) => {
//         return Object.assign(acc, {
//           [item]: pick(data.messages[item], [
//             'id', 'uuid', 'text'
//           ])
//         })
//       }, {})
//     };

//     const decodedCursors = {
//       prev: omittedData.cursors?.prev ? JSON.parse(decode(omittedData.cursors.prev)) : undefined,
//       next: omittedData.cursors?.next ? JSON.parse(decode(omittedData.cursors.next)) : undefined
//     }

//     expect(omittedData).toEqual(assertingData);
//   });




//   test('запрос набора из середины по prev курсору', async () => {
//     const cursorData = { value: messagesData[6].uuid, type: 'prev' };
//     const encodedCursor = encode(JSON.stringify(cursorData));

//     const assertingData = {
//       messages: {
//         [messagesData[2].uuid]: {
//           id: 3, uuid: messagesData[2].uuid, text: 'Тестовое сообщение №3'
//         },
//         [messagesData[3].uuid]: {
//           id: 4, uuid: messagesData[3].uuid, text: 'Тестовое сообщение №4'
//         },
//         [messagesData[4].uuid]: {
//           id: 5, uuid: messagesData[4].uuid, text: 'Тестовое сообщение №5'
//         },
//         [messagesData[5].uuid]: {
//           id: 6, uuid: messagesData[5].uuid, text: 'Тестовое сообщение №6'
//         }
//       },
//       chatRoomUuid: chatRoomData.uuid,
//       cursors: {
//         prev: encode(JSON.stringify({
//           value: messagesData[2].uuid,
//           type: 'prev'
//         })),
//         next: encode(JSON.stringify({
//           value: messagesData[5].uuid,
//           type: 'next'
//         })),
//       }
//     };

//     const data = await messageService.getMessagesOfRoom(chatRoomData.uuid, encodedCursor, 4);
//     const omittedData = {
//       ...data,
//       messages: Object.keys(data.messages).reduce((acc, item) => {
//         return Object.assign(acc, {
//           [item]: pick(data.messages[item], [
//             'id', 'uuid', 'text'
//           ])
//         })
//       }, {})
//     };

//     expect(omittedData).toEqual(assertingData);

//   });




//   test('запрос набора из середины по next курсору', async () => {
//     const cursorData = { value: messagesData[1].uuid, type: 'next' };
//     const encodedCursor = encode(JSON.stringify(cursorData));

//     const assertingData = {
//       messages: {
//         [messagesData[2].uuid]: {
//           id: 3, uuid: messagesData[2].uuid, text: 'Тестовое сообщение №3'
//         },
//         [messagesData[3].uuid]: {
//           id: 4, uuid: messagesData[3].uuid, text: 'Тестовое сообщение №4'
//         },
//         [messagesData[4].uuid]: {
//           id: 5, uuid: messagesData[4].uuid, text: 'Тестовое сообщение №5'
//         },
//         [messagesData[5].uuid]: {
//           id: 6, uuid: messagesData[5].uuid, text: 'Тестовое сообщение №6'
//         }
//       },
//       chatRoomUuid: chatRoomData.uuid,
//       cursors: {
//         prev: encode(JSON.stringify({
//           value: messagesData[2].uuid,
//           type: 'prev'
//         })),
//         next: encode(JSON.stringify({
//           value: messagesData[5].uuid,
//           type: 'next'
//         })),
//       }
//     };

//     const data = await messageService.getMessagesOfRoom(chatRoomData.uuid, encodedCursor, 4);
//     const omittedData = {
//       ...data,
//       messages: Object.keys(data.messages).reduce((acc, item) => {
//         return Object.assign(acc, {
//           [item]: pick(data.messages[item], [
//             'id', 'uuid', 'text'
//           ])
//         })
//       }, {})
//     };

//     expect(omittedData).toEqual(assertingData);
//   });




//   test('запрос последних сообщений', async () => {
//     const assertingData = {
//       messages: {
//         [messagesData[5].uuid]: {
//           id: 6, uuid: messagesData[5].uuid, text: 'Тестовое сообщение №6'
//         },
//         [messagesData[6].uuid]: {
//           id: 7, uuid: messagesData[6].uuid, text: 'Тестовое сообщение №7'
//         },
//         [messagesData[7].uuid]: {
//           id: 8, uuid: messagesData[7].uuid, text: 'Тестовое сообщение №8'
//         },
//         [messagesData[8].uuid]: {
//           id: 9, uuid: messagesData[8].uuid, text: 'Тестовое сообщение №9'
//         }
//       },
//       chatRoomUuid: chatRoomData.uuid,
//       cursors: {
//         prev: encode(JSON.stringify({
//           value: messagesData[5].uuid,
//           type: 'prev'
//         }))
//       }
//     };

//     const data = await messageService.getLastMessagesOfRoom(chatRoomData.uuid, 4);
//     const omittedData = {
//       ...data,
//       messages: Object.keys(data.messages).reduce((acc, item) => {
//         return Object.assign(acc, {
//           [item]: pick(data.messages[item], [
//             'id', 'uuid', 'text'
//           ])
//         })
//       }, {})
//     };

//     expect(omittedData).toEqual(assertingData);

//   });


//   test.only('создание сообщения', async () => {

//     const authorUuid = usersData[0].uuid;
//     const messagePostData: MessagePostData = {
//       text: 'тестовое сообщение',
//       chatRoomUuid: chatRoomData.uuid
//     };

//     const message = await messageService.createMessage(authorUuid, messagePostData);

//     const assertingData: Omit<MessageItemResponse, 'id' | 'createdAt' | 'updatedAt'> = {
//       uuid: message.uuid,
//       text: 'тестовое сообщение',
//       authorName: usersData[0].name,
//       authorUuid: usersData[0].uuid,
//       chatRoomUuid: chatRoomData.uuid
//     };

//     const omittedData = omit(message, ['id', 'createdAt', 'updatedAt', 'authorAvaPath']);

//     expect(omittedData).toEqual(assertingData);

//   });

  
//   // test('запрос последний сообщений если данных нет', async () => {

//   // });

// });