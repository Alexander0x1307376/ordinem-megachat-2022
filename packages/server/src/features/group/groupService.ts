import { Group } from "../../entity/Group";
import { User } from "../../entity/User";
import { GroupInvite } from "../../entity/GroupInvite";
import AppDataSource from "../../dataSource";
import { GroupPostData } from "./groupTypes";
import imageService from "../image/imageService";
import ApiError from "../../exceptions/apiError";
import { nanoid } from 'nanoid';

// группы, в которых состоит пользователь, включая группы, где он владелец
const userGroups = async (userUuid: string) => {

  // const queryBuilder = AppDataSource.createQueryBuilder();
  const currentUser = await User.findOneOrFail({where: {uuid: userUuid}});


  const groupsWhereMember = await AppDataSource.createQueryBuilder()
    .select('g.uuid, g.name, g.description, image.path as "avaUrl"')
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
    .setParameter('userId', currentUser.id)
    .getRawMany();

  
  const groupsWhereOwner = await AppDataSource.createQueryBuilder()
    .select('g.uuid, g.name, g.description, image.path as "avaUrl"')
    .from(Group, 'g')
    .where('g.ownerId = :ownerId', { ownerId: currentUser.id})
    .leftJoin('g.ava', 'image')
    .getRawMany();
  

  return {
    groupsWhereMember,
    groupsWhereOwner
  };
}

// детали одной группы
const show = async (uuid: string) => {
  const groupRepository = AppDataSource.getRepository(Group);

  const group = await groupRepository.findOneOrFail({
    where: {uuid},
    relations: {
      ava: true,
      members: true,
      owner: true
    }
  });
  return group;
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
  
  const user = await User.findOneOrFail({ where: { uuid: userUuid }});
  const invite = await GroupInvite.findOneOrFail({ where: { linkId }});
  const group = await Group.findOneOrFail({ where: { id: invite.groupId }});

  // не состоит ли уже в группе и не владелец ли группы

  // в группе проверить владельца
  if (user.id === group.ownerId)
    return { message: 'the user is the owner of this group' };

  // в groups_members_users найти запись, где указаны id пользователя и id группы
  const membership = await AppDataSource.createQueryBuilder()
    .from('groups_members_users', 'g_u')
    .where('g_u.usersId = :userId AND g_u.groupsId = :groupId', {userId: user.id, groupId: group.id})
    .getRawOne();

  if (membership)
    return { message: 'the user is already a member of this group' }


  await AppDataSource.createQueryBuilder()
    .insert()
    .into('groups_members_users')
    .values([{ usersId: user.id, groupsId: group.id }])
    .execute();
  
  return { message: 'ok' };

}


const leaveGroup = async (userUuid: string, groupUuid: string) => {
  const user = await User.findOneOrFail({where: {uuid: userUuid}});
  const group = await Group.findOneOrFail({where: {uuid: groupUuid}});

  await AppDataSource.createQueryBuilder()
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
    where: {uuid: user.uuid},
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
const update = async (uuid: string, data: GroupPostData | any) => {

  const currentUser = await User.findOneOrFail({
    select: ['id', 'uuid'],
    where: { uuid: data.user.uuid },
  });

  const group = await Group.findOneOrFail({
    where: { uuid }
  });

  if(group?.ownerId !== currentUser?.id) {
    throw ApiError.ForbiddenError();
  }

  const { name, description } = data;
  Object.assign(group, { name, description });
  await group.save();
  return group;
}

export default {
  userGroups,
  show,
  create,
  update,
  createInvite,
  joinGroup,
  leaveGroup
}