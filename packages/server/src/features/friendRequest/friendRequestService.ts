import { nanoid } from 'nanoid';
import AppDataSource from "../../dataSource";
import { User } from '../../entity/User';
import { FriendRequest, FriendRequestStatus } from '../../entity/FriendRequest';
import { RequestResponse, RequestsInfo } from '../../apiTypes/friendRequestTypes';
import { omit } from 'lodash';


const checkFriendRelation = async (firstUserId: number, secondUserId: number): Promise<boolean> => {
  const relations = await AppDataSource.createQueryBuilder()
    .from('users_friends_users', 'f')
    .where('f.usersId_1 = :userId1 AND f.usersId_2 = :userId2')
    .orWhere('f.usersId_2 = :userId1 AND f.usersId_1 = :userId2')
    .setParameters({
      userId1: firstUserId,
      userId2: secondUserId
    })
    .getMany();

  return relations.length ? true : false;
}

const createFriendRelation = async (firstUserId: number, secondUserId: number) => {

  const friendRelation = await AppDataSource.createQueryBuilder()
    .insert()
    .into('users_friends_users')
    .values({
      usersId_1: firstUserId,
      usersId_2: secondUserId
    })
    .execute();
  return friendRelation;
}



const getRequests = async (userUuid: string): Promise<RequestsInfo> => {
  const currentUser = await User.findOneOrFail({
    where: { uuid: userUuid }
  });


  // реквесты от текущего пользователя
  const userRequests = await AppDataSource.createQueryBuilder()
    .from('friend_requests', 'fr')
    .select('fr.uuid, user.uuid as "requesterUuid", user.name as "requestedName", image.path as "avaPath"')
    .where('fr.requesterId = :requesterId', { requesterId: currentUser.id })
    .leftJoin('fr.requested', 'user')
    .leftJoin('user.ava', 'image')
    .getRawMany();
    

  // реквесты от других к текущему пользователю
  const requestsToUser = await AppDataSource.createQueryBuilder()
    .from('friend_requests', 'fr')
    .select('fr.uuid, user.uuid as "requestedUuid", user.name as "requesterName", image.path as "avaPath"')
    .where('fr.requestedId = :requestedId', { requestedId: currentUser.id })
    .leftJoin('fr.requester', 'user')
    .leftJoin('user.ava', 'image')
    .getRawMany();


  const result: RequestsInfo = {
    userRequests,
    requestsToUser
  };
  return result;
}


// свои реквесты
const reqsOfCurrentUser = async (requesterUuid: string) => {
  const currentUser = await User.findOneOrFail({
    where: { uuid: requesterUuid }
  });

  const requests = await FriendRequest.find({
    where: { requesterId: currentUser.id}
  });

  return requests;
}

// реквесты текущему юзеру
const reqsToCurrentUser = async (requesterUuid: string) => {
  const currentUser = await User.findOneOrFail({
    where: { uuid: requesterUuid }
  });
  
  const requests = await FriendRequest.find({
    where: { requestedId: currentUser.id }
  });

  return requests;
}


// создать приглашение дружить
// если есть встречное приглашение - создаём связь
// если уже ранее отправляли приглашение - пересоздаём его
const createRequest = async (requesterUuid: string, requestedUuid: string): Promise<RequestResponse | any> => {  

  const requester = await AppDataSource.createQueryBuilder()
    .select('u.id, u.uuid, u.name, i.path as "avaPath"')
    .from(User, 'u')
    .leftJoin('u.ava', 'i')
    .where({ uuid: requesterUuid })
    .getRawOne();

  const requested = await AppDataSource.createQueryBuilder() 
    .select('u.id, u.uuid, u.name, i.path as "avaPath"')
    .from(User, 'u')
    .leftJoin('u.ava', 'i')
    .where({ uuid: requestedUuid })
    .getRawOne();

  // проверить наличие дружественной связи
  const areAlreadyFriends = await checkFriendRelation(requester.id, requested.id);
  if (areAlreadyFriends) {
    return { message: 'already friends' }
  }  

  // проверить наличие встречного приглашения
  const counterRequest = await FriendRequest.findOne({
    where: {requesterId: requested.id, requestedId: requester.id}
  });
  // если есть - ставим его как принятое и создаём дружественную связь
  if (counterRequest) {
    counterRequest.status = FriendRequestStatus.ACCEPTED;
    await counterRequest.save();
    await createFriendRelation(requester.id, requested.id);
    return counterRequest;
  }

  // проверить, не отправляли ли мы запрос ранее
  const earlyRequest = await FriendRequest.findOne({
    where: { requesterId: requester.id, requestedId: requested.id }
  });
  // если отправляли - сносим его
  if (earlyRequest) {
    await earlyRequest.remove();
  }

  // создаём приглашение
  const friendRequest = FriendRequest.create({
    requesterId: requester.id,
    requestedId: requested.id,
    linkId: nanoid()
  });
  await friendRequest.save();

  const result: RequestResponse = {
    uuid: friendRequest.uuid,
    requester: omit(requester, ['id']) as RequestResponse['requester'],
    requested: omit(requested, ['id']) as RequestResponse['requested'],
    createdAt: friendRequest.createdAt,
    updatedAt: friendRequest.updatedAt
  }
  return result;
}

// отменить (снести) приглашение.
const recallRequest = async (userUuid: string, requestUuid: string) => {

  const currentUser = await User.findOneOrFail({
    where: { uuid: userUuid }
  });

  const friendRequest = await FriendRequest.findOne({
    where: { 
      uuid: requestUuid, 
      requesterId: currentUser.id, 
      status: FriendRequestStatus.PENDING 
    }
  });
  
  if (friendRequest) {
    await friendRequest.remove();
  }
  return friendRequest;
}

// принять запрос на дружбу (ставим отношение, сносим запрос)
const acceptRequest = async (userUuid: string, requestUuid: string) => {

  // это мы
  const currentUser = await User.findOneOrFail({
    where: {uuid: userUuid}
  });

  // найти запрос, который принимаем
  const friendRequest = await FriendRequest.findOneOrFail({
    where: { uuid: requestUuid, status: FriendRequestStatus.PENDING }
  });

  // проверить встречный запрос (если мы отправляли реквестеру запрос ранее)
  const requestOfCurrentUser = await FriendRequest.findOne({
    where: { 
      requesterId: currentUser.id, 
      requestedId: friendRequest.requestedId, 
      status: FriendRequestStatus.PENDING
    }
  });
  // если есть - сносим его
  if (requestOfCurrentUser) {
    await requestOfCurrentUser.remove();
  }

  // сносим запрос
  await friendRequest.remove();

  // сохраняем отношение
  await createFriendRelation(currentUser.id, friendRequest.requesterId);

  return friendRequest;
}

// отклонить запрос на дружбу (тупо сносим его)
const declineRequest = async (userUuid: string, requestUuid: string) => {

  const friendRequest = await FriendRequest.findOneOrFail({
    where: { uuid: requestUuid, status: FriendRequestStatus.PENDING }
  });
  await friendRequest.remove();
  return friendRequest;
}

export default {
  createRequest,
  recallRequest,
  acceptRequest,
  declineRequest,
  reqsOfCurrentUser,
  reqsToCurrentUser,
  getRequests
}

