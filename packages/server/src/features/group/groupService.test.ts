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
import { omit, mapValues, pick } from 'lodash';
import createGroupService from './groupService';
import createImageService from '../image/imageService';
import { FullGroupPostData, GroupPostData } from '@ordinem-megachat-2022/shared';
import createUserService from '../user/userService';
import { ImagePostData, GroupResponse } from '@ordinem-megachat-2022/shared';
import { ChatRoom } from '../../entity/ChatRoom';

describe('манипуляции с данными групп', () => {

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
      User, UserToken, Image, Group, Channel,
      Message, GroupInvite, FriendRequest, ChatRoom
    ],
    subscribers: [],
    migrations: [],
  });


  const imageService = createImageService(AppDataSource);

  const groupService = createGroupService({
    dataSource: AppDataSource,
    imageService
  });

  const userData = { 
    id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' 
  };

  const imageData = {
    id: 1, uuid: v4(), name: 'test ava', path: 'images/test_ava.jpg'
  };

  const groupData = {
    id: 1, uuid: v4(), name: 'Тестовая группа User 1', description: 'Это тестовая группа', ownerId: 1
  };

  beforeAll(async () => {

    await AppDataSource.initialize();

    // создаём пользователя
    const user = await AppDataSource.createQueryBuilder(User, 'u')
      .insert()
      .values(userData)
      .execute();

    const image = await AppDataSource.createQueryBuilder(Image, 'i')
      .insert()
      .values(imageData)
      .execute();

    // создаём группу
    const group = await AppDataSource.createQueryBuilder(Group, 'g')
      .insert()
      .values([groupData])
      .execute();

    
  });

  afterAll(async () => {
    // сносим все созданные записи
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });


  test('группа успешно создаётся', async () => {

    const groupPostData: FullGroupPostData = {
      name: 'Тестовая группа',
      description: 'Описание тестовой группы',
      avaUuid: imageData.uuid,
      ownerUuid: userData.uuid
    };

    const group = await groupService.create(groupPostData);

    const expectedData = {
      name: 'Тестовая группа',
      description: 'Описание тестовой группы',
      avaUuid: imageData.uuid,
      avaPath: imageData.path,
      ownerUuid: userData.uuid
    };

    expect(omit(group, ['id', 'uuid', 'createdAt', 'updatedAt'])).toEqual(expectedData);

  });



  test('группа успешно изменяется. добавление аватарки', async () => {

    const groupData: FullGroupPostData = {
      name: 'начальное имя',
      description: 'начальное описание',
      ownerUuid: userData.uuid
    };

    const group = await groupService.create(groupData);

    
    const newGroupData: FullGroupPostData = {
      name: 'изменённое имя',
      description: 'изменённое описание',
      avaUuid: imageData.uuid,
      ownerUuid: userData.uuid
    };

    const updatedGroup = await groupService.update(group.uuid, newGroupData);

    const expectedData: Omit<GroupResponse, 'createdAt' | 'updatedAt'> = {
      uuid: group.uuid,
      name: 'изменённое имя',
      description: 'изменённое описание',
      avaPath: imageData.path,
      avaUuid: imageData.uuid,
      ownerUuid: userData.uuid
    };

    expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);

  });



  test('группа успешно изменяется. снос имеющейся аватарки', async () => {
    
    const groupData: FullGroupPostData = {
      name: 'начальное имя 2',
      description: 'начальное описание',
      ownerUuid: userData.uuid
    };
    
    const group = await groupService.create(groupData);
    
    const newGroupData: FullGroupPostData = {
      name: 'изменённое имя 2',
      description: 'изменённое описание',
      ownerUuid: userData.uuid
    };
    

    const updatedGroup = await groupService.update(group.uuid, newGroupData);

    const expectedData: Omit<GroupResponse, 'createdAt' | 'updatedAt'> = {
      uuid: group.uuid,
      name: 'изменённое имя 2',
      description: 'изменённое описание',
      ownerUuid: userData.uuid
    };

    const expectedResultFromDb = {
      uuid: group.uuid,
      name: 'изменённое имя 2',
      description: 'изменённое описание',
      avaId: null
    };

    const resultFromDb = await AppDataSource.createQueryBuilder(Group, 'g')
      .select('g.uuid, g.name, g.description, g."avaId"')
      .where('g.uuid = :groupUuid', { groupUuid: group.uuid })
      .getRawOne();

    expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
    expect(resultFromDb).toEqual(expectedResultFromDb);

  });



  test('группа успешно изменяется. оставление аватарки', async () => {

    const groupData: FullGroupPostData = {
      name: 'начальное имя 3',
      description: 'начальное описание',
      ownerUuid: userData.uuid,
      avaUuid: imageData.uuid
    };

    const group = await groupService.create(groupData);

    const newGroupData: FullGroupPostData = {
      name: 'изменённое имя 3',
      description: 'изменённое описание',
      ownerUuid: userData.uuid,
      avaUuid: imageData.uuid
    };

    const updatedGroup = await groupService.update(group.uuid, newGroupData);

    const resultFromDb = await AppDataSource.createQueryBuilder(Group, 'g')
      .select('g.uuid, g.name, g.description, g."avaId"')
      .where('g.uuid = :groupUuid', { groupUuid: group.uuid })
      .getRawOne();

    const expectedData: Omit<GroupResponse, 'createdAt' | 'updatedAt'> = {
      uuid: group.uuid,
      name: 'изменённое имя 3',
      description: 'изменённое описание',
      ownerUuid: userData.uuid,
      avaUuid: imageData.uuid,
      avaPath: imageData.path
    };

    const expectedResultFromDb = {
      uuid: group.uuid,
      name: 'изменённое имя 3',
      description: 'изменённое описание',
      avaId: imageData.id
    };

    expect(omit(updatedGroup, ['id', 'createdAt', 'updatedAt'])).toEqual(expectedData);
    expect(resultFromDb).toEqual(expectedResultFromDb);
  });

});