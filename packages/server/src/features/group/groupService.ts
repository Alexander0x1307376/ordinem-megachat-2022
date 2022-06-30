import { Group } from "../../entity/Group";
import { User } from "../../entity/User";
import { GroupInvite } from "../../entity/GroupInvite";
import { GroupPostData } from "./groupTypes";
import imageService from "../image/imageService";
import ApiError from "../../exceptions/apiError";
import { nanoid } from 'nanoid';
import { GroupDetailsResponse } from "@ordinem-megachat-2022/shared";
import { DataSource } from "typeorm";
import { Channel } from "../../entity/Channel";


export interface IGroupService {
  userGroups: (userUuid: string) => Promise<any>;
  groupDetails: (groupUuid: string) => Promise<GroupDetailsResponse>;
  createInvite: (inviterUuid: string, groupUuid: string) => Promise<any>;
  joinGroup: (userUuid: string, linkId: string) => Promise<any>;
  leaveGroup: (userUuid: string, groupUuid: string) => Promise<any>;
  create: (groupData: GroupPostData) => Promise<any>;
  update: (groupUuid: string, groupData: GroupPostData) => Promise<any>;
}

const createGroupService = (dataSource: DataSource) => {




  // группы, в которых состоит пользователь, включая группы, где он владелец
  const userGroups = async (userUuid: string) => {

    // const queryBuilder = dataSource.createQueryBuilder();
    const currentUser = await User.findOneOrFail({ where: { uuid: userUuid } });


    const groupsWhereMember = await dataSource.createQueryBuilder()
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


    const groupsWhereOwner = await dataSource.createQueryBuilder()
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
  const groupDetails = async (groupUuid: string) => {

    const groupData = await dataSource.createQueryBuilder(Group, 'g')
      .select(`
        g.id, g.uuid, g.name, g.description, g."createdAt", g."updatedAt",
        i.path as "avaPath",
        o.uuid as "ownerUuid", o.name as "ownerName", 
        oi.path as "ownerAvaPath"
      `)
      .where('g.uuid = :groupUuid', { groupUuid })
      .leftJoin('g.ava', 'i')
      .leftJoin('g.owner', 'o')
      .leftJoin('o.ava', 'oi')
      .getRawOne();

      const channels = await dataSource.createQueryBuilder(Channel, 'c')
        .select(`
          c.uuid, c.name, c.description, c."createdAt", c."updatedAt"
        `)
        .where('c.groupId = :groupId', {groupId: groupData.id})
        .getRawMany();

    // const members = await dataSource.createQueryBuilder(User, 'm')
    //   .select(`m.uuid, m.name, i.path as "avaPath"`)
    //   .leftJoin('m.ava', 'i')
    //   .where((qb) => {
    //     const subQuery = qb.subQuery()
    //       .select('gmu."usersId"')
    //       .from('groups_members_users', 'gmu')
    //       .where('gmu."groupsId" = :groupId')
    //       .getQuery();
    //       return 'm.id IN ' + subQuery
    //     })
    //   .setParameter('groupId', groupData.id)
    //   .getRawMany();


    const result: GroupDetailsResponse = {
      uuid: groupUuid,
      name: groupData.name,
      description: groupData.description,
      createdAt: groupData.createdAt,
      updatedAt: groupData.updatedAt,
      avaPath: groupData.avaPath,
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
  const createInvite = async (inviterUuid: string, groupUuid: string) => {
    const inviter = await User.findOneOrFail({ where: { uuid: inviterUuid } });
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
  const joinGroup = async (userUuid: string, linkId: string) => {

    const user = await User.findOneOrFail({ where: { uuid: userUuid } });
    const invite = await GroupInvite.findOneOrFail({ where: { linkId } });
    const group = await Group.findOneOrFail({ where: { id: invite.groupId } });

    // не состоит ли уже в группе и не владелец ли группы

    // в группе проверить владельца
    if (user.id === group.ownerId)
      return { message: 'the user is the owner of this group' };

    // в groups_members_users найти запись, где указаны id пользователя и id группы
    const membership = await dataSource.createQueryBuilder()
      .from('groups_members_users', 'g_u')
      .where('g_u.usersId = :userId AND g_u.groupsId = :groupId', { userId: user.id, groupId: group.id })
      .getRawOne();

    if (membership)
      return { message: 'the user is already a member of this group' }


    await dataSource.createQueryBuilder()
      .insert()
      .into('groups_members_users')
      .values([{ usersId: user.id, groupsId: group.id }])
      .execute();

    return { message: 'ok' };

  }


  const leaveGroup = async (userUuid: string, groupUuid: string) => {
    const user = await User.findOneOrFail({ where: { uuid: userUuid } });
    const group = await Group.findOneOrFail({ where: { uuid: groupUuid } });

    await dataSource.createQueryBuilder()
      .delete()
      .from('groups_members_users')
      .where('usersId = :userId AND groupsId = :groupId', { userId: user.id, groupId: group.id })
      .execute();

    return { message: 'ok' }
  }


  // создать группу
  const create = async ({
    name,
    description,
    imageData,
    user
  }: GroupPostData | any) => {

    const owner = await User.findOne({
      select: ['id', 'uuid'],
      where: { uuid: user.uuid },
    });

    let image;
    if (imageData)
      image = await imageService.create(imageData);

    const group = Group.create({
      name, description, avaId: image?.id, ownerId: owner?.id
    });
    await group.save();

    return group;
  }

  // изменить группу (неотправленные поля не обновляются)
  const update = async (groupUuid: string, data: GroupPostData | any) => {

    const currentUser = await User.findOneOrFail({
      select: ['id', 'uuid'],
      where: { uuid: data.user.uuid },
    });

    const group = await Group.findOneOrFail({
      where: { uuid: groupUuid }
    });

    if (group?.ownerId !== currentUser?.id) {
      throw ApiError.ForbiddenError();
    }

    const { name, description } = data;
    Object.assign(group, { name, description });
    await group.save();
    return group;
  }

  return {
    userGroups,
    groupDetails,
    create,
    update,
    createInvite,
    joinGroup,
    leaveGroup
  } as IGroupService
}

export default createGroupService;