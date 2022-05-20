import AppDataSource from "../../dataSource";
import { User } from '../../entity/User';
import { FriendRequest } from '../../entity/FriendRequest';
import { FriendRequest as FriendRequestType, RequestsInfo, FriendRequestUuids } from '@ordinem-megachat-2022/shared';
import { omit } from 'lodash';
import ApiError from '../../exceptions/apiError';

type ResultMessage = {
  message: string;
  type?: string;
  data?: any;
}


export interface IFriendRequestService {
  createRequest: (
    requesterUuid: string, requestedUuid: string
  ) => Promise<FriendRequestType | ResultMessage>;
  recallRequest: (userUuid: string, requestUuid: string) => Promise<FriendRequestUuids>;
  acceptRequest: (userUuid: string, requestUuid: string) => Promise<FriendRequestUuids>;
  declineRequest: (userUuid: string, requestUuid: string) => Promise<FriendRequestUuids>;
  getRequests: (userUuid: string) => Promise<RequestsInfo['friendRequests']>;
}

export const createFriendRequestService = () => {


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



  const getRequests = async (userUuid: string): Promise<RequestsInfo['friendRequests']> => {
    const currentUser = await User.findOneOrFail({
      where: { uuid: userUuid }
    });


    const selectString = `
    fr.uuid, 
    requester.uuid as "requesterUuid", 
    requester.name as "requesterName", 
    "requesterAva".path as "requesterAvaPath",
    requested.uuid as "requestedUuid", 
    requested.name as "requestedName", 
    "requestedAva".path as "requestedAvaPath",
    fr."createdAt",
    fr."updatedAt"
  `;

    // реквесты от текущего пользователя
    const outcomingRequests = await AppDataSource.createQueryBuilder()
      .from('friend_requests', 'fr')
      .select(selectString)
      .where('fr.requesterId = :requesterId', { requesterId: currentUser.id })
      .leftJoin('fr.requester', 'requester')
      .leftJoin('fr.requested', 'requested')
      .leftJoin('requester.ava', 'requesterAva')
      .leftJoin('requested.ava', 'requestedAva')
      .getRawMany();


    // реквесты от других к текущему пользователю
    const incomingRequests = await AppDataSource.createQueryBuilder()
      .from('friend_requests', 'fr')
      .select(selectString)
      .where('fr.requestedId = :requestedId', { requestedId: currentUser.id })
      .leftJoin('fr.requester', 'requester')
      .leftJoin('fr.requested', 'requested')
      .leftJoin('requester.ava', 'requesterAva')
      .leftJoin('requested.ava', 'requestedAva')
      .getRawMany();


    const queryToResult = (queryData: any[]): FriendRequestType[] => queryData.map(({
      uuid,
      requesterUuid, requesterName, requesterAvaPath,
      requestedUuid, requestedName, requestedAvaPath,
      createdAt, updatedAt
    }: any) => ({
      uuid,
      requester: {
        uuid: requesterUuid,
        name: requesterName,
        avaPath: requesterAvaPath
      },
      requested: {
        uuid: requestedUuid,
        name: requestedName,
        avaPath: requestedAvaPath
      },
      createdAt,
      updatedAt
    }));

    const result: RequestsInfo['friendRequests'] = {
      outcomingRequests: queryToResult(outcomingRequests),
      incomingRequests: queryToResult(incomingRequests)
    };
    return result;
  }



  // создать приглашение дружить
  // в общем случае - создаём реквест, возвращаем данные реквеста
  // если есть встречное приглашение - создаём связь, возвращаем сообщение о связи
  // если уже друзья - возвращаем сообщение о том, что уже друзья
  // если уже ранее отправляли приглашение - возвращаем старый запрос
  const createRequest = async (
    requesterUuid: string, requestedUuid: string
  ): Promise<FriendRequestType | ResultMessage> => {

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
      throw ApiError.BadRequest('Already friends');
    }

    // проверить наличие встречного приглашения
    const counterRequest = await AppDataSource.createQueryBuilder()
      .from(FriendRequest, 'fr')
      .select('fr.id, fr.uuid, rer.uuid as "requesterUuid", red.uuid as "requestedUuid"')
      .leftJoin('fr.requester', 'rer')
      .leftJoin('fr.requested', 'red')
      .where({ requesterId: requested.id, requestedId: requester.id })
      .getRawOne();

    // если есть - сносим его и создаём дружественную связь
    if (counterRequest) {

      await AppDataSource.createQueryBuilder()
        .delete()
        .from(FriendRequest)
        .where({ id: counterRequest.id })
        .execute();

      await createFriendRelation(requester.id, requested.id);
      return {
        message: 'There was a counter request. The friend relation was created',
        type: 'counterRequest',
        data: omit(counterRequest, ['id']) as FriendRequestUuids
      } as ResultMessage;
    }

    // проверить, не отправляли ли мы запрос ранее
    const earlyRequest = await FriendRequest.findOne({
      where: { requesterId: requester.id, requestedId: requested.id }
    });
    // если отправляли - возвращаем его
    if (earlyRequest) {
      return {
        uuid: earlyRequest.uuid,
        requester: omit(requester, ['id']) as FriendRequestType['requester'],
        requested: omit(requested, ['id']) as FriendRequestType['requested'],
        createdAt: earlyRequest.createdAt,
        updatedAt: earlyRequest.updatedAt
      }
    }

    // создаём приглашение
    const friendRequest = FriendRequest.create({
      requesterId: requester.id,
      requestedId: requested.id,
    });
    await friendRequest.save();

    return {
      uuid: friendRequest.uuid,
      requester: omit(requester, ['id']) as FriendRequestType['requester'],
      requested: omit(requested, ['id']) as FriendRequestType['requested'],
      createdAt: friendRequest.createdAt,
      updatedAt: friendRequest.updatedAt
    } as FriendRequestType;
  }

  // отменить (снести) приглашение.
  const recallRequest = async (userUuid: string, requestUuid: string): Promise<FriendRequestUuids> => {

    const currentUser = await User.findOneOrFail({
      where: { uuid: userUuid }
    });


    const friendRequest = await AppDataSource.createQueryBuilder()
      .from(FriendRequest, 'fr')
      .select(`fr.uuid, requester.uuid as "requesterUuid", requested.uuid as "requestedUuid"`)
      .leftJoin('fr.requester', 'requester')
      .leftJoin('fr.requested', 'requested')
      .where({
        uuid: requestUuid,
        requesterId: currentUser.id
      })
      .getRawOne();


    if (!friendRequest)
      throw ApiError.NotFound(`Запрос дружбы uuid:${requestUuid} от пользователя ${currentUser.name} не найден`);

    AppDataSource.createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where({ uuid: friendRequest.uuid })
      .execute();


    return {
      uuid: friendRequest.uuid,
      requesterUuid: friendRequest.requesterUuid,
      requestedUuid: friendRequest.requestedUuid
    };
  }

  // принять запрос на дружбу (ставим отношение, сносим запрос)
  const acceptRequest = async (userUuid: string, requestUuid: string): Promise<FriendRequestUuids> => {

    // это мы
    const currentUser = await User.findOneOrFail({
      where: { uuid: userUuid }
    });

    const friendRequest = await AppDataSource.createQueryBuilder()
      .from(FriendRequest, 'fr')
      .select(`
      fr.uuid, 
      requester.uuid as "requesterUuid", 
      requester.id as "requesterId", 
      requested.uuid as "requestedUuid",
      requested.id as "requestedId"
    `)
      .leftJoin('fr.requester', 'requester')
      .leftJoin('fr.requested', 'requested')
      .where({ uuid: requestUuid })
      .getRawOne();



    // проверить встречный запрос (если мы отправляли реквестеру запрос ранее)
    const requestOfCurrentUser = await FriendRequest.findOne({
      select: ['id'],
      where: {
        requesterId: currentUser.id,
        requestedId: friendRequest.requestedId
      }
    });
    // если есть - сносим его
    if (requestOfCurrentUser) {
      await requestOfCurrentUser.remove();
    }

    // сносим запрос
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where({ uuid: friendRequest.uuid })
      .execute();

    // сохраняем отношение
    await createFriendRelation(currentUser.id, friendRequest.requesterId);
    return {
      uuid: friendRequest.uuid,
      requesterUuid: friendRequest.requesterUuid,
      requestedUuid: friendRequest.requestedUuid
    };
  }


  // отклонить запрос на дружбу (тупо сносим его)
  const declineRequest = async (userUuid: string, requestUuid: string): Promise<FriendRequestUuids> => {

    const friendRequest = await AppDataSource.createQueryBuilder()
      .from(FriendRequest, 'fr')
      .select(`fr.uuid, requester.uuid as "requesterUuid", requested.uuid as "requestedUuid"`)
      .leftJoin('fr.requester', 'requester')
      .leftJoin('fr.requested', 'requested')
      .where({ uuid: requestUuid })
      .getRawOne();

    if (!friendRequest)
      throw ApiError.NotFound('Не найден запрос для отклонения. Возможно он был отозван отправителем');

    await AppDataSource.createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where({ uuid: friendRequest.uuid })
      .execute();

    return {
      uuid: friendRequest.uuid,
      requestedUuid: friendRequest.requestedUuid,
      requesterUuid: friendRequest.requesterUuid
    };
  }

  const service: IFriendRequestService = {
    createRequest,
    recallRequest,
    acceptRequest,
    declineRequest,
    getRequests
  } 
  return service;
}

export default createFriendRequestService;

