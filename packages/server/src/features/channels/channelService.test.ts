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
import createChannelService from './channelService';
import { Conversation } from '../../entity/Conversation';
import { ChatRoom } from '../../entity/ChatRoom';
import { omit } from 'lodash';


describe('манипуляции с данными каналов', () => {

  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5442,
    username: "postgres",
    password: "secret",
    database: "ordinem_megachat",
    synchronize: true,
    logging: false,
    entities: [
      ChatRoom, User, UserToken, Image, Group, Channel,
      Message, GroupInvite, FriendRequest, Conversation
    ],
    subscribers: [],
    migrations: [],
  });


  const channelService = createChannelService({
    dataSource: AppDataSource
  });

  const usersData = [
    { id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' },
  ];

  const groupData = {
    id: 1, uuid: v4(), name: 'Тестовая группа User 1', description: 'Это тестовая группа', ownerId: 1
  };

  
  const chatRoomData = { id: 1, uuid: v4() };
  const channelData = { id: 1, uuid: v4(), name: 'Тестовый канал', groupId: 1, chatRoomId: 1 };


  beforeAll(async () => {

    await AppDataSource.initialize();

    // создаём пользователей
    const usersResult = await AppDataSource.createQueryBuilder(User, 'u')
      .insert()
      .values(usersData)
      .execute();

    // создаём группу
    const group = await AppDataSource.createQueryBuilder(Group, 'g')
      .insert()
      .values([groupData])
      .execute();

    // создаём канал с комнатой

    const chatRoom = await AppDataSource.createQueryBuilder()
      .insert()
      .into('chatrooms')
      .values([chatRoomData])
      .execute();

    const channel = await AppDataSource.createQueryBuilder(Channel, 'c')
      .insert()
      .values([channelData])
      .execute();
  });

  afterAll(async () => {
    // сносим все созданные записи
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });


  test('канал создаётся вместе с со своим чатрумом', async () => {
    
    const channel = await channelService.createChannel({
      name: 'Канал!',
      description: 'описание',
      groupUuid: groupData.uuid
    });

    // данные канала из модели
    const assertingChannelData = {
      uuid: channel.uuid,
      name: 'Канал!',
      description: 'описание',
      groupUuid: groupData.uuid,
      chatRoomUuid: channel.chatRoomUuid
    };

    // данные комнаты
    const assertingChatRoomData = {
      uuid: channel.chatRoomUuid
    };
    
    // данные комнаты из БД
    const chatRoomData = await AppDataSource.createQueryBuilder(ChatRoom, 'r')
      .select('r.uuid as uuid')
      .where('r.uuid = :uuid', { uuid: channel.chatRoomUuid })
      .getRawOne();

    expect(omit(channel, ['createdAt', 'updatedAt'])).toEqual(assertingChannelData);
    expect(chatRoomData).toEqual(assertingChatRoomData);
  });


  test('канал удаляется из базы вместе с чатрумом, данные канала возвращаются', async () => {

    const newChannel = await channelService.createChannel({
      name: 'Новый канал',
      description: 'описание',
      groupUuid: groupData.uuid
    });

    const deletedChannelData = await channelService.removeChannel(newChannel.uuid);

    const assertingData = {
      uuid: newChannel.uuid,
      name: 'Новый канал',
      description: 'описание',
      groupUuid: groupData.uuid,
      chatRoomUuid: deletedChannelData.chatRoomUuid
    };

    // данные комнаты из БД
    const chatRoomData = await AppDataSource.createQueryBuilder(ChatRoom, 'r')
      .select('r.uuid as uuid')
      .where('r.uuid = :uuid', { uuid: newChannel.uuid })
      .getRawOne();

      
    expect(chatRoomData).toEqual(undefined);
    expect(omit(deletedChannelData, ['createdAt', 'updatedAt'])).toEqual(assertingData);
    
  });

  
});