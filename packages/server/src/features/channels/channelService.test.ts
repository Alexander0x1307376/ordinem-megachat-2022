import 'reflect-metadata';
import { v4 } from 'uuid';
import { Channel } from '../../entity/Channel';
import { Group } from '../../entity/Group';
import { User } from '../../entity/User';
import { ChannelService } from './ChannelService';
import { ChatRoom } from '../../entity/ChatRoom';
import { omit } from 'lodash';
import { Container } from 'inversify';
import { ChannelEventEmitter } from './ChannelEventEmitter';
import { AppDataSource } from '../../AppDataSource';
import { TYPES } from '../../injectableTypes';
import { IConfigService } from '../config/IConfigService';
import { IChannelService } from './IChannelService';
import { configServiceMock } from '../../tests/mocks/configServiceMock';
import { DataSource } from 'typeorm';



describe('манипуляции с данными каналов', () => {


  const usersData = [
    { id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' },
  ];

  const groupData = {
    id: 1, uuid: v4(), name: 'Тестовая группа User 1', description: 'Это тестовая группа', ownerId: 1
  };

  const chatRoomData = { id: 1, uuid: v4() };
  const channelData = { id: 1, uuid: v4(), name: 'Тестовый канал', groupId: 1, chatRoomId: 1 };


  const container = new Container({
    skipBaseClassChecks: true
  });
  let configService: IConfigService;
  let appDataSource: AppDataSource;
  let dataSource: DataSource;
  let channelEventEmitter: ChannelEventEmitter;
  let channelService: IChannelService;

  
  beforeAll(async () => {

    channelEventEmitter = new ChannelEventEmitter();
    
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
    container.bind<AppDataSource>(TYPES.DataSource).to(AppDataSource).inSingletonScope();
    container.bind<ChannelEventEmitter>(TYPES.ChannelEventEmitter).toConstantValue(channelEventEmitter);
    container.bind<IChannelService>(TYPES.ChannelService).to(ChannelService);

    configService = container.get<IConfigService>(TYPES.ConfigService);
    appDataSource = container.get<AppDataSource>(TYPES.DataSource);
    channelEventEmitter = container.get<ChannelEventEmitter>(TYPES.ChannelEventEmitter);
    channelService = container.get<IChannelService>(TYPES.ChannelService);


    await appDataSource.init();
    dataSource = appDataSource.dataSource;

    // создаём пользователей
    const usersResult = await dataSource.createQueryBuilder(User, 'u')
      .insert()
      .values(usersData)
      .execute();

    // создаём группу
    const group = await dataSource.createQueryBuilder(Group, 'g')
      .insert()
      .values([groupData])
      .execute();

    // создаём канал с комнатой
    const chatRoom = await dataSource.createQueryBuilder()
      .insert()
      .into('chatrooms')
      .values([chatRoomData])
      .execute();

    const channel = await dataSource.createQueryBuilder(Channel, 'c')
      .insert()
      .values([channelData])
      .execute();
  });

  afterAll(async () => {
    // сносим все созданные записи
    await dataSource.dropDatabase();
    await dataSource.destroy();
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
    const chatRoomData = await appDataSource.dataSource.createQueryBuilder(ChatRoom, 'r')
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
    const chatRoomData = await appDataSource.dataSource.createQueryBuilder(ChatRoom, 'r')
      .select('r.uuid as uuid')
      .where('r.uuid = :uuid', { uuid: newChannel.uuid })
      .getRawOne();

      
    expect(chatRoomData).toEqual(undefined);
    expect(omit(deletedChannelData, ['createdAt', 'updatedAt'])).toEqual(assertingData);
    
  });

});