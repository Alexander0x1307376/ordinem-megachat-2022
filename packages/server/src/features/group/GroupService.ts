import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { TYPES } from '../../injectableTypes';
import { DataSource, Repository } from 'typeorm';
import { IImageService } from '../image/IImageService';
import { User } from '../../entity/User';
import { Image } from '../../entity/Image';
import { Group } from '../../entity/Group';
import { Channel } from '../../entity/Channel';
import { FullGroupPostData, GroupDetailsResponse, GroupResponse } from '@ordinem-megachat-2022/shared';
import { GroupInvite } from '../../entity/GroupInvite';
import { nanoid } from 'nanoid';
import ApiError from '../../exceptions/apiError';
import { IGroupService } from './IGroupService';
import { GroupEventEmitter } from './GroupEventEmitter';
import { AppDataSource } from '../../AppDataSource'; 

@injectable()
export class GroupService implements IGroupService {

  private userRepository: Repository<User>;
  private imageRepository: Repository<Image>;
  private groupInviteRepository: Repository<GroupInvite>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource,
    @inject(TYPES.ImageService) private imageService: IImageService,
    @inject(TYPES.GroupEventEmitter) private groupEventEmitter: GroupEventEmitter
  ) {
    this.dataSource = dataSource.dataSource;
    this.userRepository = this.dataSource.getRepository(User);
    this.imageRepository = this.dataSource.getRepository(Image);
    this.groupInviteRepository = this.dataSource.getRepository(GroupInvite);
  }

  // группы, в которых состоит пользователь, включая группы, где он владелец
  async userGroups(userUuid: string) {

    // const queryBuilder = dataSource.createQueryBuilder();
    const currentUser = await this.userRepository.findOneOrFail({ where: { uuid: userUuid } });


    const groupsWhereMember = await this.dataSource.createQueryBuilder()
      .select(
        `g.uuid, g.name, g.description, u.uuid as "ownerUuid", 
      image.path as "avaUrl", g."createdAt", g."updatedAt"`
      )
      .from(Group, 'g')
      .where((qb) => {
        const subQuery = qb.subQuery()
          .select('g_u.groupsId')
          .from('groups_members_users', 'g_u')
          .where('g_u.usersId = :userId')
          .getQuery();
        return 'g.id IN ' + subQuery;
      })
      .leftJoin('g.ava', 'image')
      .leftJoin('g.owner', 'u')
      .setParameter('userId', currentUser.id)
      .getRawMany();


    const groupsWhereOwner = await this.dataSource.createQueryBuilder()
      .select(
        `g.uuid, g.name, g.description, u.uuid as "ownerUuid", 
      image.path as "avaUrl", g."createdAt", g."updatedAt"`)
      .from(Group, 'g')
      .where('g.ownerId = :ownerId', { ownerId: currentUser.id })
      .leftJoin('g.ava', 'image')
      .leftJoin('g.owner', 'u')
      .getRawMany();


    return {
      groupsWhereMember,
      groupsWhereOwner
    };
  }


  // детали одной группы
  async groupDetails(groupUuid: string) {

    const groupData = await this.dataSource.createQueryBuilder(Group, 'g')
      .select(`
        g.id, g.uuid, g.name, g.description, g."createdAt", g."updatedAt",
        i.path as "avaPath",
        i.uuid as "avaUuid",
        o.uuid as "ownerUuid", o.name as "ownerName", 
        oi.path as "ownerAvaPath"
      `)
      .where('g.uuid = :groupUuid', { groupUuid })
      .leftJoin('g.ava', 'i')
      .leftJoin('g.owner', 'o')
      .leftJoin('o.ava', 'oi')
      .getRawOne();

    const channels = await this.dataSource.createQueryBuilder(Channel, 'c')
      .select(`
        c.uuid, c.name, c.description, c."createdAt", c."updatedAt"
      `)
      .where('c.groupId = :groupId', { groupId: groupData.id })
      .getRawMany();


    const result: GroupDetailsResponse = {
      uuid: groupUuid,
      name: groupData.name,
      description: groupData.description,
      createdAt: groupData.createdAt,
      updatedAt: groupData.updatedAt,
      avaPath: groupData.avaPath,
      avaUuid: groupData.avaUuid,
      owner: {
        uuid: groupData.ownerUuid,
        name: groupData.ownerName,
        avaPath: groupData.ownerAvaPath
      },
      channels
    };

    return result;
  }


  // создание инвайта в группу
  async createInvite(inviterUuid: string, groupUuid: string) {
    const inviter = await this.userRepository.findOneOrFail({ where: { uuid: inviterUuid } });
    const group = await Group.findOneOrFail({ where: { uuid: groupUuid } });


    // TODO: проверить права

    const invite = GroupInvite.create({
      linkId: nanoid(),
      inviterId: inviter.id,
      groupId: group.id
    });
    await invite.save();
    return invite;
  }


  // присоединение пользователя к группе
  async joinGroup(userUuid: string, linkId: string) {

    const user = await this.userRepository.findOneOrFail({ where: { uuid: userUuid } });
    const invite = await GroupInvite.findOneOrFail({ where: { linkId } });
    const group = await Group.findOneOrFail({ where: { id: invite.groupId } });

    // не состоит ли уже в группе и не владелец ли группы

    // в группе проверить владельца
    if (user.id === group.ownerId)
      return { message: 'the user is the owner of this group' };

    // в groups_members_users найти запись, где указаны id пользователя и id группы
    const membership = await this.dataSource.createQueryBuilder()
      .from('groups_members_users', 'g_u')
      .where('g_u.usersId = :userId AND g_u.groupsId = :groupId', { userId: user.id, groupId: group.id })
      .getRawOne();

    if (membership)
      return { message: 'the user is already a member of this group' }


    await this.dataSource.createQueryBuilder()
      .insert()
      .into('groups_members_users')
      .values([{ usersId: user.id, groupsId: group.id }])
      .execute();

    return { message: 'ok' };

  }


  async leaveGroup(userUuid: string, groupUuid: string) {
    const user = await this.userRepository.findOneOrFail({ where: { uuid: userUuid } });
    const group = await Group.findOneOrFail({ where: { uuid: groupUuid } });

    await this.dataSource.createQueryBuilder()
      .delete()
      .from('groups_members_users')
      .where('usersId = :userId AND groupsId = :groupId', { userId: user.id, groupId: group.id })
      .execute();

    return { message: 'ok' }
  }


  // создать группу
  async create({
    name,
    description,
    ownerUuid,
    avaUuid
  }: FullGroupPostData) {

    const owner = await this.userRepository.findOne({
      select: ['id', 'uuid'],
      where: { uuid: ownerUuid },
    });

    const image = avaUuid ? await this.imageService.getItem(avaUuid) : undefined;

    const group = Group.create({
      name, description, avaId: image?.id, ownerId: owner?.id
    });
    await group.save();

    const result: GroupResponse = {
      uuid: group.uuid,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
      ownerUuid: owner!.uuid,
      avaPath: image?.path,
      avaUuid: image?.uuid
    };
    this.groupEventEmitter.emitCreated(result);

    return result;
  }

  // изменить группу (неотправленные поля не обновляются)
  async update(groupUuid: string, data: FullGroupPostData) {

    const currentUser = await this.userRepository.findOneOrFail({
      select: ['id', 'uuid'],
      where: { uuid: data.ownerUuid },
    });

    const image = data.avaUuid ? await this.imageService.getItem(data.avaUuid) : undefined;

    const group = await Group.findOneOrFail({
      where: { uuid: groupUuid }
    });

    if (group?.ownerId !== currentUser?.id) {
      throw ApiError.ForbiddenError();
    }

    const { name, description } = data;
    Object.assign(group, { name, description, avaId: image?.id ? image.id : null });
    await group.save();

    const result: GroupResponse = {
      uuid: group.uuid,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
      ownerUuid: currentUser!.uuid,
      avaPath: image?.path,
      avaUuid: image?.uuid
    };

    this.groupEventEmitter.emitUpdated(result);
    return result;
  }
}