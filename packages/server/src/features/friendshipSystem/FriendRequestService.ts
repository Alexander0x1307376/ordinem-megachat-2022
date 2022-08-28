import 'reflect-metadata';
import {
  FriendRequest as FriendRequestType,
  RequestsInfo,
  FriendRequestUuids,
  FriendRequestMessage
} from '@ordinem-megachat-2022/shared'; 
import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { ChatRoom } from '../../entity/ChatRoom';
import { DirectChat } from '../../entity/DirectChat';
import { FriendRequest } from '../../entity/FriendRequest';
import { User } from '../../entity/User';
import ApiError from '../../exceptions/apiError';
import { TYPES } from '../../injectableTypes';
import { FriendshipSystemEventEmitter } from './FriendshipSystemEventEmitter';
import { IFriendRequestService } from "./IFriendRequestService";
import { AppDataSource } from '../../AppDataSource'; 


const createFriendRequestMessage = ({
  requestedUuid, requesterUuid, requestedName
}: {
  requesterUuid: string;
  requestedUuid?: string;
  requestedName: string;
},
  status: FriendRequestMessage['status']
): FriendRequestMessage => ({
  data: {
    requested: { name: requestedName, uuid: requestedUuid },
    requester: { uuid: requesterUuid }
  },
  status
});


@injectable()
export class FriendRequestService implements IFriendRequestService {

  private chatRoomRepository: Repository<ChatRoom>;
  private directChatRepository: Repository<DirectChat>;
  private userRepository: Repository<User>;
  private friendRequestRepository: Repository<FriendRequest>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource,
    @inject(TYPES.FriendshipEventEmitter) private friendshipEventEmitter: FriendshipSystemEventEmitter
  ) {
    this.dataSource = dataSource.dataSource;
    this.chatRoomRepository = this.dataSource.getRepository(ChatRoom);
    this.directChatRepository = this.dataSource.getRepository(DirectChat);
    this.userRepository = this.dataSource.getRepository(User);
    this.friendRequestRepository = this.dataSource.getRepository(FriendRequest);
  }

  private async checkFriendRelation(firstUserId: number, secondUserId: number): Promise<boolean> {
    const relations = await this.dataSource.createQueryBuilder()
      .select('f."usersId_1", f."usersId_2"')
      .from('users_friends_users', 'f')
      .where('f."usersId_1" = :userId1 AND f."usersId_2" = :userId2')
      .orWhere('f."usersId_2" = :userId1 AND f."usersId_1" = :userId2')
      .setParameters({
        userId1: firstUserId,
        userId2: secondUserId
      })
      .getRawMany();

    return relations.length ? true : false;
  }



  private async createFriendRelation(firstUserId: number, secondUserId: number) {

    const friendRelation = await this.dataSource.createQueryBuilder()
      .insert()
      .into('users_friends_users')
      .values({
        usersId_1: firstUserId,
        usersId_2: secondUserId
      })
      .execute();
    return friendRelation;
  }


  private async findOrCreateDirectChat(firstUserId: number, secondUserId: number) {
    const directChat = await this.directChatRepository
      .findOne({
        where: [
          { user1Id: firstUserId, user2Id: secondUserId },
          { user2Id: firstUserId, user1Id: secondUserId }
        ]     
      });

    if(directChat) 
      return directChat;
    else
      return await this.createDirectChat(firstUserId, secondUserId);
  }

  private async createDirectChat(firstUserId: number, secondUserId: number) {

    const chatRoom = await this.chatRoomRepository
      .create().save();

    const directChat = await this.directChatRepository
      .create({
        user1Id: firstUserId,
        user2Id: secondUserId,
        chatRoomId: chatRoom.id
      }).save();

    return directChat;
  }


  async getRequests(userUuid: string): Promise<RequestsInfo> {
     const currentUser = await this.userRepository.findOneOrFail({
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
    const outcomingRequests = await  this.dataSource.createQueryBuilder()
      .from('friend_requests', 'fr')
      .select(selectString)
      .where('fr.requesterId = :requesterId', { requesterId: currentUser.id })
      .leftJoin('fr.requester', 'requester')
      .leftJoin('fr.requested', 'requested')
      .leftJoin('requester.ava', 'requesterAva')
      .leftJoin('requested.ava', 'requestedAva')
      .getRawMany();


    // реквесты от других к текущему пользователю
    const incomingRequests = await  this.dataSource.createQueryBuilder()
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

    const result: RequestsInfo = {
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
  async createRequest(
    requesterUuid: string, requestedName: string
  ): Promise<FriendRequestMessage> {

    const requester = await  this.dataSource.createQueryBuilder()
      .select('u.id, u.uuid, u.name, i.path as "avaPath"')
      .from(User, 'u')
      .leftJoin('u.ava', 'i')
      .where({ uuid: requesterUuid })
      .getRawOne();

    if (requester.name === requestedName) {
      return createFriendRequestMessage({
        requesterUuid,
        requestedName
      }, 'toSelf');
    }

    const requested = await  this.dataSource.createQueryBuilder()
      .select('u.id, u.uuid, u.name, i.path as "avaPath"')
      .from(User, 'u')
      .leftJoin('u.ava', 'i')
      .where({ name: requestedName })
      .getRawOne();

    if (!requested) {
      return createFriendRequestMessage({
        requesterUuid,
        requestedName
      }, 'noRequestedUser');
    }

    // проверить наличие дружественной связи
    const areAlreadyFriends = await this.checkFriendRelation(requester.id, requested.id);

    if (areAlreadyFriends) {
      return createFriendRequestMessage({
        requesterUuid,
        requestedName,
        requestedUuid: requested.uuid
      }, 'alreadyFriends');
    }

    // проверить наличие встречного приглашения
    const counterRequest = await  this.dataSource.createQueryBuilder()
      .from(FriendRequest, 'fr')
      .select('fr.id, fr.uuid, rer.uuid as "requesterUuid", red.uuid as "requestedUuid"')
      .leftJoin('fr.requester', 'rer')
      .leftJoin('fr.requested', 'red')
      .where({ requesterId: requested.id, requestedId: requester.id })
      .getRawOne();

    // если есть - сносим его и создаём дружественную связь
    if (counterRequest) {

      await  this.dataSource.createQueryBuilder()
        .delete()
        .from(FriendRequest)
        .where({ id: counterRequest.id })
        .execute();

      await this.createFriendRelation(requester.id, requested.id);

      this.friendshipEventEmitter.emitFriendsChanged({
        userUuid_1: requesterUuid,
        userUuid_2: requested.uuid
      });
      return createFriendRequestMessage({
        requesterUuid,
        requestedName,
        requestedUuid: requested.uuid
      }, 'counterRequest');
    }

    // проверить, не отправляли ли мы запрос ранее
    const earlyRequest = await FriendRequest.findOne({
      where: { requesterId: requester.id, requestedId: requested.id }
    });
    // если отправляли - возвращаем его
    if (earlyRequest) {
      return createFriendRequestMessage({
        requesterUuid,
        requestedName,
        requestedUuid: requested.uuid
      }, 'success');
    }

    // создаём приглашение
    const friendRequest = FriendRequest.create({
      requesterId: requester.id,
      requestedId: requested.id,
    });
    await friendRequest.save();

    this.friendshipEventEmitter.emitFriendsChanged({
      userUuid_1: requesterUuid,
      userUuid_2: requested.uuid
    });
    return createFriendRequestMessage({
      requesterUuid,
      requestedName,
      requestedUuid: requested.uuid
    }, 'success');
  }

  // отменить (снести) приглашение.
  async recallRequest(userUuid: string, requestUuid: string): Promise<FriendRequestUuids> {

    const currentUser = await User.findOneOrFail({
      where: { uuid: userUuid }
    });


    const friendRequest = await  this.dataSource.createQueryBuilder()
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

     this.dataSource.createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where({ uuid: friendRequest.uuid })
      .execute();

    this.friendshipEventEmitter.emitFriendRequestChanged({
      requesterUuid: friendRequest.requesterUuid,
      requestedUuid: friendRequest.requestedUuid
    });
    return {
      uuid: friendRequest.uuid,
      requesterUuid: friendRequest.requesterUuid,
      requestedUuid: friendRequest.requestedUuid
    };
  }

  // принять запрос на дружбу (ставим отношение, сносим запрос)
  async acceptRequest(userUuid: string, requestUuid: string): Promise<FriendRequestUuids> {

    // это мы
    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid }
    });

    const friendRequest = await  this.dataSource.createQueryBuilder()
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
    const requestOfCurrentUser = await this.friendRequestRepository.findOne({
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
    await  this.dataSource.createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where({ uuid: friendRequest.uuid })
      .execute();

    // сохраняем отношение
    await this.createFriendRelation(currentUser.id, friendRequest.requesterId);
    
    //  создаём личную беседу
    await this.findOrCreateDirectChat(currentUser.id, friendRequest.requesterId);

    this.friendshipEventEmitter.emitFriendsChanged({
      userUuid_1: currentUser.uuid,
      userUuid_2: friendRequest.requesterUuid
    });
    return {
      uuid: friendRequest.uuid,
      requesterUuid: friendRequest.requesterUuid,
      requestedUuid: friendRequest.requestedUuid
    };
  }


  // отклонить запрос на дружбу (тупо сносим его)
  async declineRequest(userUuid: string, requestUuid: string): Promise<FriendRequestUuids> {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid }
    });


    const friendRequest = await  this.dataSource.createQueryBuilder()
      .from(FriendRequest, 'fr')
      .select(`fr.uuid, requester.uuid as "requesterUuid", requested.uuid as "requestedUuid"`)
      .leftJoin('fr.requester', 'requester')
      .leftJoin('fr.requested', 'requested')
      .where({ uuid: requestUuid })
      .getRawOne();

    if (!friendRequest)
      throw ApiError.NotFound('Не найден запрос для отклонения. Возможно он был отозван отправителем');

    await  this.dataSource.createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where({ uuid: friendRequest.uuid })
      .execute();

    this.friendshipEventEmitter.emitFriendRequestChanged({
      requestedUuid: friendRequest.requestedUuid,
      requesterUuid: friendRequest.requesterUuid
    });
    return {
      uuid: friendRequest.uuid,
      requestedUuid: friendRequest.requestedUuid,
      requesterUuid: friendRequest.requesterUuid
    };
  }
}