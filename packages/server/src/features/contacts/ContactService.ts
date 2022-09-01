import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../injectableTypes';
import { Contacts, DirectChat as DirectChatType } from "@ordinem-megachat-2022/shared";
import { User } from '../../entity/User';
import { Conversation } from '../../entity/Conversation';
import { DirectChat } from '../../entity/DirectChat';
import { isNil, omitBy } from 'lodash';
import { IContactService } from './IContactService';
import { AppDataSource } from '../../AppDataSource'; 
import ApiError from '../../exceptions/apiError';

@injectable()
export class ContactService implements IContactService {

  private userRepository: Repository<User>;
  private directChatRepository: Repository<DirectChat>;

  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource
  ) {
    this.dataSource = dataSource.dataSource;
    this.userRepository = this.dataSource.getRepository(User);
    this.directChatRepository = this.dataSource.getRepository(DirectChat);
  }

  async getUserContacts(userUuid: string): Promise<Contacts> {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    // получаем все беседы пользователя
    const conversations = await this.dataSource.createQueryBuilder(Conversation, 'c')
      .select(`
        c.uuid, c.name, c.description, i.path AS "avaPath",
        r.uuid AS "chatRoomUuid", u.uuid AS "ownerUuid"
      `)
      .leftJoin('c.ava', 'i')
      .leftJoin('c.chatRoom', 'r')
      .leftJoin('c.owner', 'u')
      .where((qb) => {
        const subQuery = qb.subQuery()
          .from('conversations_members_users', 'cm')
          .select('cm."conversationsId"')
          .where('cm."usersId" = :userId')
          .getQuery();
        return 'c.id IN ' + subQuery;
      })
      .orWhere('c."ownerId" = :userId')
      .setParameter('userId', currentUser.id)
      .getRawMany();

    // получаем прямые чаты пльзователей
    const directChats = await this.dataSource.createQueryBuilder(DirectChat, 'dc')
      .select(`
        dc.uuid, r.uuid AS "chatRoomUuid", 
        u1.uuid AS "user1Uuid", u1.name AS "user1Name", i1.path AS "user1AvaPath", 
        u2.uuid AS "user2Uuid", u2.name AS "user2Name", i2.path AS "user2AvaPath"
      `)
      .leftJoin('dc.chatRoom', 'r')
      .leftJoin('dc.user1', 'u1')
      .leftJoin('dc.user2', 'u2')
      .leftJoin('u1.ava', 'i1')
      .leftJoin('u2.ava', 'i2')
      .where('dc."user1Id" = :userId')
      .orWhere('dc."user2Id" = :userId')
      .setParameter('userId', currentUser.id)
      .getRawMany();


    const processedDirectChats = directChats.map((item) => {

      const {
        uuid, chatRoomUuid, user1Uuid, user1Name, user1AvaPath,
        user2Uuid, user2Name, user2AvaPath
      } = item;

      const contactor = userUuid === user1Uuid ? {
        uuid: user2Uuid,
        name: user2Name,
        avaPath: user2AvaPath
      } : {
        uuid: user1Uuid,
        name: user1Name,
        avaPath: user1AvaPath
      };

      const result = {
        uuid,
        chatRoomUuid,
        contactor: omitBy(contactor, isNil)
      };
      return result as any;

    });


    const result = {
      conversations: conversations.map(item => omitBy(item, isNil)),
      directChats: processedDirectChats
    };
    return result as Contacts;
  }

  async getContact(userUuid: string, contactUuid: string): Promise<DirectChatType> {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const directChat = await this.dataSource.createQueryBuilder(DirectChat, 'dc')
      .select(`
        dc.uuid, dc."chatRoomId", dc."user1Id", dc."user2Id", 
        cr.uuid AS "chatRoomUuid",
        u1.uuid AS "user1Uuid", u1.name AS "user1Name",
        i1.path AS "user1AvaPath",
        u2.uuid AS "user2Uuid", u2.name AS "user2Name",
        i2.path AS "user2AvaPath"
      `)
      .where('dc.uuid = :contactUuid', { contactUuid })
      .leftJoin('dc.chatRoom', 'cr')
      .leftJoin('dc.user1', 'u1')
      .leftJoin('dc.user2', 'u2')
      .leftJoin('u1.ava', 'i1')
      .leftJoin('u2.ava', 'i2')
      .getRawOne();

    if(!directChat)
      throw ApiError.NotFound();

    if (currentUser.id !== directChat.user1Id && currentUser.id !== directChat.user2Id)
      throw ApiError.ForbiddenError();
    

    const contactor: DirectChatType['contactor'] = userUuid === directChat.user1Uuid ? {
      uuid: directChat.user2Uuid,
      name: directChat.user2Name,
      avaPath: directChat.user2AvaPath
    } : {
      uuid: directChat.user1Uuid,
      name: directChat.user1Name,
      avaPath: directChat.user1AvaPath
    };

    const result: DirectChatType = {
      uuid: userUuid,
      chatRoomUuid: directChat.chatRoomUuid,
      contactor
    };
    return result;
  }
}