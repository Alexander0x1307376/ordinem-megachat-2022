import 'reflect-metadata';
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
import { Container } from 'inversify';
import { IConversationService } from '../conversation/IConversationService';
import { IContactService } from './IContactService';
import { IConfigService } from '../config/IConfigService';
import { TYPES } from '../../injectableTypes';
import { configServiceMock } from '../../tests/mocks/configServiceMock';
import { AppDataSource } from '../../AppDataSource';
import { ContactService } from './ContactService';


describe('контакты пользователя', () => {

  const usersData = [
    { id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' },
    { id: 2, uuid: v4(), name: 'User 2', email: 'user2@test.dev', password: '1234' },
    { id: 3, uuid: v4(), name: 'User 3', email: 'user3@test.dev', password: '1234' },
    { id: 4, uuid: v4(), name: 'User 4', email: 'user4@test.dev', password: '1234' }
  ];
  const friendshipRelations = [
    { usersId_1: 1, usersId_2: 2 },
    { usersId_1: 1, usersId_2: 3 },
    { usersId_1: 1, usersId_2: 4 },
  ];
  const directChatRooms = [
    { id: 1, uuid: v4() },
    { id: 2, uuid: v4() },
    { id: 3, uuid: v4() }
  ];
  const directChats = [
    { id: 1, uuid: v4(), user1Id: 1, user2Id: 2, chatRoomId: 1 },
    { id: 2, uuid: v4(), user1Id: 1, user2Id: 3, chatRoomId: 2 },
    { id: 3, uuid: v4(), user1Id: 1, user2Id: 4, chatRoomId: 3 }
  ];

  const convRules = { whiteList: [], blackList: [] };
  const conversationChatRooms = [
    { id: 4, uuid: v4() },
    { id: 5, uuid: v4() },
    { id: 6, uuid: v4() }
  ];
  const conversationsData = [
    { 
      id: 1, uuid: v4(), 
      name: 'Беседа 1', 
      description: 'описание беседы 1', 
      chatRoomId: 4, ownerId: 1,
      rules: convRules
    },
    { id: 1, uuid: v4(), chatRoomId: 5, ownerId: 1, rules: convRules },
    { id: 1, uuid: v4(), name: 'Беседа 2', ownerId: 2, chatRoomId: 2, rules: convRules }
  ];
  const converstionMembers = [
    { conversationsId: 1, usersId: 1 },
    { conversationsId: 1, usersId: 2 },
    { conversationsId: 1, usersId: 3 },

    { conversationsId: 2, usersId: 1 },
    { conversationsId: 2, usersId: 2 },
    { conversationsId: 2, usersId: 3 },

    { conversationsId: 3, usersId: 3 },
    { conversationsId: 3, usersId: 2 }
  ];

  const container = new Container({
    skipBaseClassChecks: true
  });

  let configService: IConfigService;
  let appDataSource: AppDataSource;
  let contactService: IContactService;

  beforeAll(async () => {

    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
    container.bind<AppDataSource>(TYPES.DataSource).to(AppDataSource).inSingletonScope();
    container.bind<IContactService>(TYPES.ContactService).to(ContactService);
    
    configService = container.get<IConfigService>(TYPES.ConfigService);
    appDataSource = container.get<AppDataSource>(TYPES.DataSource);
    contactService = container.get<IContactService>(TYPES.ContactService);

    await appDataSource.init();
    let dataSource = appDataSource.dataSource;
    
    await dataSource.createQueryBuilder()
      .insert()
      .into('users')
      .values(usersData)
      .execute();

    // отношения дружбы, комнаты и "прямые чаты"
    await dataSource.createQueryBuilder()
      .insert()
      .into('users_friends_users')
      .values(friendshipRelations)
      .execute();

    await dataSource.createQueryBuilder()
      .insert()
      .into('chatrooms')
      .values(directChatRooms)
      .execute();

    await dataSource.createQueryBuilder()
      .insert()
      .into('direct_chats')
      .values(directChats)
      .execute();
      
    // беседы
    await dataSource.createQueryBuilder()
      .insert()
      .into('chatrooms')
      .values(conversationChatRooms)
      .execute();

    await dataSource.createQueryBuilder()
      .insert()
      .into('conversations')
      .values(conversationsData)
      .execute();

    await dataSource.createQueryBuilder()
      .insert()
      .into('conversations_members_users')
      .values(converstionMembers)
      .execute();

  });

  afterAll(async () => {
    // сносим все созданные записи
    await appDataSource.dataSource.dropDatabase();
    await appDataSource.dataSource.destroy();
  });

  test('запрос всех чятегов пользователя (личные сообщения и беседы)', async () => {

    // создать дару пользователей, пару бесед и запросить их
    const result = await contactService.getUserContacts(usersData[0].uuid);
    
    const assertedData = {
      conversations: [
        {
          uuid: conversationsData[0].uuid,
          name: conversationsData[0].name,
          description: conversationsData[0].description,
          chatRoomUuid: conversationChatRooms[0].uuid,
          ownerUuid: usersData[0].uuid
        },
        {
          uuid: conversationsData[1].uuid,
          chatRoomUuid: conversationChatRooms[1].uuid,
          ownerUuid: usersData[0].uuid
        }
      ].sort(),
      directChats: [
        {
          uuid: directChats[0].uuid,
          chatRoomUuid: directChatRooms[0].uuid,
          contactor: {
            uuid: usersData[1].uuid,
            name: usersData[1].name
          }
        },
        {
          uuid: directChats[1].uuid,
          chatRoomUuid: directChatRooms[1].uuid,
          contactor: {
            uuid: usersData[2].uuid,
            name: usersData[2].name
          }
        },
        {
          uuid: directChats[2].uuid,
          chatRoomUuid: directChatRooms[2].uuid,
          contactor: {
            uuid: usersData[3].uuid,
            name: usersData[3].name
          }
        }
      ].sort()
    };


    expect({
      conversations: result.conversations.sort(),
      directChats: result.directChats.sort()
    }).toEqual(assertedData);

  });

});