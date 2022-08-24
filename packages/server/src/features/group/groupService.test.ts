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
// import createGroupService from './groupService';
// import createImageService from '../image/imageService';
import { FullGroupPostData, GroupPostData } from '@ordinem-megachat-2022/shared';
// import createUserService from '../user/userService';
import { ImagePostData, GroupResponse } from '@ordinem-megachat-2022/shared';
import { ChatRoom } from '../../entity/ChatRoom';
import { IImageService } from '../image/IImageService';
import { IGroupService } from './IGroupService';
import { AppDataSource } from '../../AppDataSource';
import { IConfigService } from '../config/IConfigService';
import { Container } from 'inversify';
import { TYPES } from '../../injectableTypes';
import { configServiceMock } from '../../tests/mocks/configServiceMock';
import { ImageService } from '../image/ImageService';
import { GroupService } from './GroupService';

describe('манипуляции с данными групп', () => {

  const userData = { 
    id: 1, uuid: v4(), name: 'User 1', email: 'user1@test.dev', password: '1234' 
  };

  const imageData = {
    id: 1, uuid: v4(), name: 'test ava', path: 'images/test_ava.jpg'
  };

  const groupData = {
    id: 1, uuid: v4(), name: 'Тестовая группа User 1', description: 'Это тестовая группа', ownerId: 1
  };

  // const imageService = createImageService(AppDataSource);

  // const groupService = createGroupService({
  //   dataSource: AppDataSource,
  //   imageService
  // });

  const container = new Container({
    skipBaseClassChecks: true
  });
  let configService: IConfigService;
  let appDataSource: AppDataSource;
  let imageService: IImageService;
  let groupService: IGroupService;
  let dataSource: DataSource;

  beforeAll(async () => {

    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
    container.bind<AppDataSource>(TYPES.DataSource).to(AppDataSource).inSingletonScope();
    container.bind<IImageService>(TYPES.ImageService).to(ImageService);
    container.bind<IGroupService>(TYPES.GroupService).to(GroupService);
  
    configService = container.get<IConfigService>(TYPES.ConfigService);
    appDataSource = container.get<AppDataSource>(TYPES.DataSource);
    imageService = container.get<IImageService>(TYPES.ImageService);


    await appDataSource.init();
    dataSource = appDataSource.dataSource;

    // создаём пользователя
    const user = await dataSource.createQueryBuilder(User, 'u')
      .insert()
      .values(userData)
      .execute();

    const image = await dataSource.createQueryBuilder(Image, 'i')
      .insert()
      .values(imageData)
      .execute();

    // создаём группу
    const group = await dataSource.createQueryBuilder(Group, 'g')
      .insert()
      .values([groupData])
      .execute();

    
  });

  afterAll(async () => {
    // сносим все созданные записи
    await dataSource.dropDatabase();
    await dataSource.destroy();
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

    const resultFromDb = await dataSource.createQueryBuilder(Group, 'g')
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

    const resultFromDb = await dataSource.createQueryBuilder(Group, 'g')
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