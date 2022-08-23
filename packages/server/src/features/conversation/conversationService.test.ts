import { DataSource } from "typeorm";
import { Channel } from '../../entity/Channel';
import { FriendRequest } from '../../entity/FriendRequest';
import { Group } from '../../entity/Group';
import { GroupInvite } from '../../entity/GroupInvite';
import { Image } from '../../entity/Image';
import { Message } from '../../entity/Message';
import { User } from '../../entity/User';
import { UserToken } from '../../entity/UserToken';
import { Conversation } from '../../entity/Conversation';
import { ChatRoom } from '../../entity/ChatRoom';
import { v4 } from "uuid";
// import createConversationService from "./conversationService";
import { 
  ConversationPostData, 
  Conversation as ConversationType, 
  ConversationWithMembers,
  ConversationFullPostData
} from "@ordinem-megachat-2022/shared";
import { isNil, omitBy } from "lodash";

describe('беседы на нескольких пользователей', () => {

});

// describe('беседы на нескольких пользователей', () => {

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
//       ChatRoom, User, UserToken, Image, Group, Channel,
//       Message, GroupInvite, FriendRequest, Conversation
//     ],
//     subscribers: [],
//     migrations: [],
//   });

//   const conversationService = createConversationService({dataSource: AppDataSource});

//   const usersData = [
//     { id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' },
//     { id: 2, uuid: v4(), name: 'User 2', email: 'user2@test.dev', password: '1234' },
//     { id: 3, uuid: v4(), name: 'User 3', email: 'user3@test.dev', password: '1234' },
//     { id: 4, uuid: v4(), name: 'User 4', email: 'user4@test.dev', password: '1234' }
//   ];

//   beforeAll(async () => {

//     await AppDataSource.initialize();

//     const users = await AppDataSource.createQueryBuilder(User, 'u')
//       .insert()
//       .values(usersData)
//       .execute();

//   });

//   afterAll(async () => {
//     // сносим все созданные записи
//     await AppDataSource.dropDatabase();
//     await AppDataSource.destroy();
//   });

//   test('беседа успешно создаётся', async () => {

//     const conversationPostData: ConversationFullPostData = {
//       memberUuids: [
//         usersData[1].uuid,
//         usersData[2].uuid
//       ]
//     };

//     const conversation = await conversationService.createConveration(usersData[0].uuid, conversationPostData);

//     const conversationRow = await AppDataSource.createQueryBuilder(Conversation, 'c')
//       .select('c.id AS id, c.uuid AS uuid')
//       .where('c.uuid = :uuid', {uuid: conversation.uuid})
//       .getRawOne();

//     const chatRoomRow = await AppDataSource.createQueryBuilder(ChatRoom, 'c')
//       .select('c.id AS id, c.uuid AS uuid')
//       .where('c.uuid = :uuid', {uuid: conversation.chatRoomUuid})
//       .getRawOne();

//     const membersRows = await AppDataSource.createQueryBuilder()
//       .from('conversations_members_users', 'm')
//       .select('m."conversationsId" AS "conversationsId", m."usersId" AS "usersId"')
//       .where('m."conversationsId" = :convId', {convId: conversationRow.id})
//       .getRawMany();

//     const assertedConversation: ConversationType = {
//       uuid: conversationRow.uuid,
//       ownerUuid: usersData[0].uuid,
//       chatRoomUuid: chatRoomRow.uuid,
//     };

//     const assertedMembers = [
//       { conversationsId: conversationRow.id, usersId: usersData[0].id },
//       { conversationsId: conversationRow.id, usersId: usersData[1].id },
//       { conversationsId: conversationRow.id, usersId: usersData[2].id }
//     ];

//     const assertedMemberIds = assertedMembers.map(item => item.usersId).sort();
//     const actualMemberIds = membersRows.map(item => item.usersId).sort();

//     const areMembersCorrect = assertedMemberIds.every((item, index) => {
//       return item == actualMemberIds[index];
//     });

//     expect(conversation).toEqual(expect.objectContaining(assertedConversation));
//     expect(areMembersCorrect).toEqual(true);
//   });


  
//   test('успешное добвление новых участников в беседу', async () => {

//     const conversation = await conversationService.createConveration(usersData[0].uuid, {
//       memberUuids: [usersData[1].uuid]
//     });
    
//     const result = await conversationService.addMembersToConversation(usersData[0].uuid, conversation.uuid, [
//       usersData[2].uuid, usersData[3].uuid
//     ]);


//     const conversationRow = await AppDataSource.createQueryBuilder(Conversation, 'c')
//       .select('c.id AS id, c.uuid AS uuid')
//       .where('c.uuid = :uuid', { uuid: conversation.uuid })
//       .getRawOne();

//     const membersRows = await AppDataSource.createQueryBuilder()
//       .from('conversations_members_users', 'm')
//       .select('m."conversationsId" AS "conversationsId", m."usersId" AS "usersId"')
//       .where('m."conversationsId" = :convId', { convId: conversationRow.id })
//       .getRawMany();


//     const assertedConversation: ConversationType = {
//       uuid: conversationRow.uuid,
//       ownerUuid: usersData[0].uuid,
//       chatRoomUuid: conversation.chatRoomUuid,
//     };


//     const assertedMembers = [
//       { conversationsId: conversationRow.id, usersId: usersData[0].id },
//       { conversationsId: conversationRow.id, usersId: usersData[1].id },
//       { conversationsId: conversationRow.id, usersId: usersData[2].id }
//     ];

//     const assertedMemberIds = assertedMembers.map(item => item.usersId).sort();
//     const actualMemberIds = membersRows.map(item => item.usersId).sort();

//     const areMembersCorrect = assertedMemberIds.every((item, index) => {
//       return item == actualMemberIds[index];
//     });


//     expect(areMembersCorrect).toEqual(true);
//     expect(result).toEqual(expect.objectContaining(assertedConversation));


//     await AppDataSource.createQueryBuilder()
//       .delete()
//       .from(Conversation)
//       .where('uuid = :uuid', { uuid: conversation.uuid })
//       .execute();
//   });



//   test('успешное удаление участников из беседы', async () => {
    
//     const conversation = await conversationService.createConveration(usersData[0].uuid, {
//       memberUuids: [ usersData[1].uuid, usersData[2].uuid ]
//     });

//     const result = await conversationService.removeMembersFromConversation(
//       usersData[0].uuid, conversation.uuid, [usersData[2].uuid]
//     );

//     const conversationRow = await AppDataSource.createQueryBuilder(Conversation, 'c')
//       .select('c.id AS id, c.uuid AS uuid')
//       .where('c.uuid = :uuid', { uuid: conversation.uuid })
//       .getRawOne();

//     const membersRows = await AppDataSource.createQueryBuilder()
//       .from('conversations_members_users', 'm')
//       .select('m."conversationsId" AS "conversationsId", m."usersId" AS "usersId"')
//       .where('m."conversationsId" = :convId', { convId: conversationRow.id })
//       .getRawMany();


//     const assertedConversation: ConversationType = {
//       uuid: conversationRow.uuid,
//       ownerUuid: usersData[0].uuid,
//       chatRoomUuid: conversation.chatRoomUuid,
//     };

//     const assertedMembers = [
//       { conversationsId: conversationRow.id, usersId: usersData[0].id },
//       { conversationsId: conversationRow.id, usersId: usersData[1].id }
//     ];

//     const assertedMemberIds = assertedMembers.map(item => item.usersId).sort();
//     const actualMemberIds = membersRows.map(item => item.usersId).sort();

//     const areMembersCorrect = assertedMemberIds.every((item, index) => {
//       return item == actualMemberIds[index];
//     });


//     expect(areMembersCorrect).toEqual(true);
//     expect(result).toEqual(expect.objectContaining(assertedConversation));

//     await AppDataSource.createQueryBuilder()
//       .delete()
//       .from(Conversation)
//       .where('uuid = :uuid', { uuid: conversation.uuid })
//       .execute();
//   });



//   test('удаление самого себя, ошибка', async () => {
//     const conversation = await conversationService.createConveration(usersData[0].uuid, {
//       memberUuids: [usersData[1].uuid, usersData[2].uuid]
//     });

//     async function testRemovingHimself() {
//       const result = await conversationService.removeMembersFromConversation(
//         usersData[0].uuid, conversation.uuid, [usersData[2].uuid, usersData[0].uuid]
//       );
//     };

//     expect(testRemovingHimself).rejects.toThrowError(new Error("the owner can't kick himself"));

//     await AppDataSource.createQueryBuilder()
//       .delete()
//       .from(Conversation)
//       .where('uuid = :uuid', { uuid: conversation.uuid })
//       .execute();
//   });



//   test('изменение данных беседы, успех', async () => {

//     const conversation = await conversationService.createConveration(usersData[0].uuid, {
//       memberUuids: [usersData[1].uuid, usersData[2].uuid]
//     });

//     const updatedConversation = await conversationService.updateConveration(usersData[0].uuid, conversation.uuid, {
//       name: 'Нормальное название'
//     });

//     const assertedConversationData: ConversationType = {
//       uuid: conversation.uuid,
//       name: 'Нормальное название',
//       ownerUuid: usersData[0].uuid,
//       chatRoomUuid: conversation.chatRoomUuid
//     };

//     const conversationRow = await AppDataSource.createQueryBuilder(Conversation, 'c')
//       .select('c.uuid AS uuid, c.name AS name')
//       .where('c.uuid = :uuid', { uuid: conversation.uuid })
//       .getRawOne();

//     expect(updatedConversation).toEqual(assertedConversationData);
//     expect(updatedConversation).toEqual(expect.objectContaining(conversationRow));

//     await AppDataSource.createQueryBuilder()
//       .delete()
//       .from(Conversation)
//       .where('uuid = :uuid', { uuid: conversationRow.uuid })
//       .execute();
//   });



//   test('снос беседы, успех', async () => {
    
//     const conversation = await conversationService.createConveration(usersData[0].uuid, {
//       memberUuids: [usersData[1].uuid, usersData[2].uuid]
//     });

//     const removedConversation = await conversationService.removeConversation(
//       usersData[0].uuid, conversation.uuid
//     );

//     const assertedRemovedConversation: ConversationType = {
//       uuid: conversation.uuid,
//       name: conversation.name,
//       description: conversation.description,
//       chatRoomUuid: conversation.chatRoomUuid,
//       ownerUuid: conversation.ownerUuid,
//       avaPath: conversation.avaPath
//     };

//     // Проверяем, что связанные записи тоже снеслись
//     const membersRows = await AppDataSource.createQueryBuilder()
//       .select('*')
//       .from('conversations_members_users', 'c')
//       .where((qb) => {
//         const subQuery = qb.subQuery()
//           .from(Conversation, 'sc')
//           .select('sc.id')
//           .where('sc.uuid = :convUuid')
//           .getQuery();
//         return 'c."conversationsId" IN ' + subQuery;
//       })
//       .setParameter('convUuid', conversation.uuid)
//       .getRawMany();

//     const chatRoomRow = await AppDataSource.createQueryBuilder(ChatRoom, 'r')
//       .select('r.id')
//       .where((qb) => {
//         const subQuery = qb.subQuery()
//           .from(Conversation, 'c')
//           .select('c.id')
//           .where('c.uuid = :uuid')
//           .getQuery();
//         return 'r.id IN ' + subQuery;
//       })
//       .setParameter('uuid', conversation.uuid)
//       .getRawOne();

      
//     expect(removedConversation).toEqual(expect.objectContaining(assertedRemovedConversation));
//     expect(chatRoomRow).toBe(undefined);
//     expect(membersRows).toEqual([]);
//   });



//   test.only('запрос бесед юзера, где он владелец или участник', async () => {

//     const conversation1 = await conversationService.createConveration(usersData[0].uuid, {
//       memberUuids: [usersData[1].uuid, usersData[2].uuid]
//     });
//     const conversation2 = await conversationService.createConveration(usersData[1].uuid, {
//       memberUuids: [usersData[0].uuid, usersData[2].uuid]
//     });
//     const conversation3 = await conversationService.createConveration(usersData[2].uuid, {
//       memberUuids: [usersData[0].uuid, usersData[1].uuid]
//     });


//     const conversationsOfUser = await conversationService.conversationsOfUser(usersData[0].uuid);

//     const assertedData: ConversationType[] = [
//       {
//         uuid: conversation1.uuid,
//         name: conversation1.name,
//         description: conversation1.description,
//         chatRoomUuid: conversation1.chatRoomUuid,
//         ownerUuid: conversation1.ownerUuid,
//         avaPath: conversation1.avaPath
//       },
//       {
//         uuid: conversation2.uuid,
//         name: conversation2.name,
//         description: conversation2.description,
//         chatRoomUuid: conversation2.chatRoomUuid,
//         ownerUuid: conversation2.ownerUuid,
//         avaPath: conversation2.avaPath
//       },
//       {
//         uuid: conversation3.uuid,
//         name: conversation3.name,
//         description: conversation3.description,
//         chatRoomUuid: conversation3.chatRoomUuid,
//         ownerUuid: conversation3.ownerUuid,
//         avaPath: conversation3.avaPath
//       },
//     ];

//     expect(conversationsOfUser.sort()).toEqual(assertedData.map(item => omitBy(item, isNil)).sort());

//   });
// });