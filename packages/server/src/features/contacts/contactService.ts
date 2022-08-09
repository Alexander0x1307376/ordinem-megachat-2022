import { Contacts, User as UserType } from "@ordinem-megachat-2022/shared";
import { isNil, omitBy } from "lodash";
import { DataSource } from "typeorm";
import { ChatRoom } from "../../entity/ChatRoom";
import { Conversation } from "../../entity/Conversation";
import { DirectChat } from "../../entity/DirectChat";
import { User } from "../../entity/User";

type ContactItem = {
  uuid: string;
  name: string;
  avaPath: string;
  description?: string;
  type: 'user' | 'conversation';
}


export interface IContactService {
  getUserContacts: (userUuid: string) => Promise<Contacts>;
}

const createContactService = ({dataSource} : { dataSource: DataSource }) => {

  const getUserContacts = async (userUuid: string) => {

    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    // получаем все беседы пользователя
    const conversations = await dataSource.createQueryBuilder(Conversation, 'c')
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
    const directChats = await dataSource.createQueryBuilder(DirectChat, 'dc')
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


  const service: IContactService = {
    getUserContacts
  }
  return service;
}

export default createContactService;