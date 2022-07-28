import { Message } from "../../entity/Message";
import { Channel } from "../../entity/Channel";
import {encode, decode} from 'js-base64';
import { MessageItemResponse, MessagePostData, MessageSet } from "@ordinem-megachat-2022/shared";
import { User } from "../../entity/User";
import ApiError from "../../exceptions/apiError";
import { DataSource, LessThan, MoreThan } from "typeorm";
import { validateCursorData } from "../../utils/cursorUtils";
import AppDataSource from "../../dataSource";
import { ChatRoom } from "../../entity/ChatRoom";


export interface IMessageService {
  getMessagesOfRoom: (roomUuid: string, cursor: string, count?: number) => Promise<MessageSet>;
  getLastMessagesOfRoom: (roomUuid: string, count?: number) => Promise<MessageSet>;
  createMessage: (authorUuid: string, messageData: MessagePostData) => Promise<MessageItemResponse>;
}

type Cursor = {
  value: string;
  type: 'prev' | 'next';
}


const createMessageService = ({
  dataSource
}: {
  dataSource: DataSource
}) => {

  const getLastMessagesOfRoom = async (roomUuid: string, count: number = 20) => {

    const room = await dataSource.getRepository(ChatRoom)
      .findOneOrFail({
        select: ['id'],
        where: { uuid: roomUuid },
      });

    const messages = await dataSource.createQueryBuilder(Message, 'm')
      .select(`
        m.id,
        m.uuid, m.text, m."createdAt", m."updatedAt", 
        u.uuid as "authorUuid", u.name as "authorName", 
        image.path as "authorAvaPath"
      `)
      .orderBy('m.id', "DESC")
      .leftJoin('m.author', 'u')
      .leftJoin('u.ava', 'image')
      .where({
        chatRoomId: room.id,
      })
      .limit(count)
      .getRawMany();

    if(!messages.length)
      return { chatRoomUuid: roomUuid, messages: {}, cursors: {} } as MessageSet;


    const messagesObj = messages.reduce((acc, item) => {
      return {
        ...acc,
        [item.uuid]: item
      };
    }, {} as Record<string, any>);

    const cursors = {
      prev: encode(JSON.stringify({
        value: messages[messages.length - 1].uuid,
        type: 'prev'
      }))
    }

    return {
      messages: messagesObj,
      chatRoomUuid: roomUuid,
      cursors
    } as MessageSet
  }
      


  const getMessagesOfChannel = async (chatRoomUuid: string, cursor: string, count: number = 20) => {
    
    const cursorData = JSON.parse(decode(cursor)) as Cursor;
    if(!validateCursorData(cursorData))
      throw new Error('cursor is not valid!!');

    const room = await dataSource.getRepository(ChatRoom).findOneOrFail({
      select: ['id'],
      where: { uuid: chatRoomUuid },
    });

    const anchorMessage = await Message.findOneOrFail({ select: ['id'], where: { uuid: cursorData.value }});

    const messages = await dataSource.createQueryBuilder(Message, 'm')
      .select(`
        m.id,
        m.uuid, m.text, m."createdAt", m."updatedAt", 
        u.uuid as "authorUuid", u.name as "authorName",
        image.path as "authorAvaPath"
      `)
      .orderBy('m.id', cursorData.type === 'next' ? "ASC" : "DESC")
      .leftJoin('m.author', 'u')
      .leftJoin('u.ava', 'image')
      .where({
        chatRoomId: room.id,
        id: cursorData.type === 'next' 
          ? MoreThan(anchorMessage.id) 
          : LessThan(anchorMessage.id)
      })
      .limit(count)
      .getRawMany();

    if (!messages.length)
      return { chatRoomUuid, messages: {}, cursors: {} } as MessageSet;

    // при входящем курсоре prev - сортировка по id от большего к меньшему (DESC)
    // поэтому граничную запись - искать с конца
    
    // TODO: не забыть снести
    let cursorIds: any = {};

    let newCursorData: any = {};
    // если входящий курсор - prev (для данных перед текущим набором)
    if(cursorData.type === 'prev') {
      newCursorData.next = {
        value: messages[0].uuid,
        type: 'next'
      };
      cursorIds.next = messages[0].id;
    }
    // если входящий курсор - next (для данных после текущего набора)
    if (cursorData.type === 'next') {
      newCursorData.prev = {
        value: messages[0].uuid,
        type: 'prev'
      };
      cursorIds.prev = messages[0].id;
    }

    // определяем границу (с той стороны, где нет курсора)
    const boundaryMessage = await dataSource.createQueryBuilder(Message, 'm')
      .select('m.id')
      .where({
        id: cursorData.type === 'next' 
          ? MoreThan(messages[messages.length - 1].id)
          : LessThan(messages[messages.length - 1].id)
      })
      .getRawOne();

    if (boundaryMessage) {
      if (cursorData.type === 'prev') {
        newCursorData.prev = {
          value: messages[messages.length - 1].uuid,
          type: 'prev'
        }
        cursorIds.prev = messages[messages.length - 1].id;
      }
      if (cursorData.type === 'next') {
        newCursorData.next = {
          value: messages[messages.length - 1].uuid,
          type: 'next'
        }
        cursorIds.next = messages[messages.length - 1].id;
      }
    }


    const messagesObj = messages.reduce((acc, item) => {
      return {
        ...acc,
        [item.uuid]: item
      };
    }, {} as Record<string, any>);

    const encryptedCursorData: any = {};
    if(newCursorData.prev)
      encryptedCursorData.prev = encode(JSON.stringify(newCursorData.prev));
    if (newCursorData.next)
      encryptedCursorData.next = encode(JSON.stringify(newCursorData.next));

    return {
      messages: messagesObj,
      chatRoomUuid,
      cursors: encryptedCursorData
    } as MessageSet
  }



  const createMessage = async (authorUuid: string, messageData: MessagePostData) => {

    const author = await dataSource.createQueryBuilder(User, 'a')
      .select('a.id, a.uuid, a.name, i.path as "authorAvaPath"')
      .leftJoin('a.ava', 'i')
      .where('a.uuid = :authorUuid', { authorUuid })
      .getRawOne();

    if(!author)
      throw ApiError.BadRequest(`Author with uuid ${authorUuid} not found`);

    const room = await dataSource.createQueryBuilder(ChatRoom, 'r')
      .select('r.id, r.uuid')
      .where('r.uuid = :chatRoomUuid', { chatRoomUuid: messageData.chatRoomUuid })
      .getRawOne();
    
    if (!room)
      throw ApiError.BadRequest(`Chatroom with uuid ${messageData.chatRoomUuid} not found`);

    const message = Message.create({
      text: messageData.text,
      authorId: author.id,
      chatRoomId: room.id
    });
    await message.save();

    const result: MessageItemResponse = {
      id: message.id,
      uuid: message.uuid,
      text: message.text,
      authorName: author.name,
      authorUuid: author.uuid,
      authorAvaPath: author.authorAvaPath,
      chatRoomUuid: room.uuid,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    };

    return result;
  }

  const result: IMessageService = {
    getLastMessagesOfRoom,
    getMessagesOfRoom: getMessagesOfChannel,
    createMessage
  }

  return result;
}

export default createMessageService;