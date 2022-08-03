import { ConversationPostData, Conversation as ConversationType, ConversationWithMembers, ConversationFullPostData } from "@ordinem-megachat-2022/shared";
import { isNil, omitBy, pick } from "lodash";
import { DataSource, In } from "typeorm";
import { ChatRoom } from "../../entity/ChatRoom";
import { Conversation } from "../../entity/Conversation";
import { Image } from "../../entity/Image";
import { User } from "../../entity/User";



export interface IConversationService {
  createConveration: (userUuid: string, data: ConversationFullPostData) => Promise<ConversationType>;
  updateConveration: (userUuid: string, conversationUuid: string, data: ConversationPostData) => Promise<ConversationType>;
  removeConversation: (userUuid: string, conversationUuid: string) => Promise<ConversationType>;
  conversationsOfUser: (userUuid: string) => Promise<ConversationType[]>;
  addMembersToConversation: (userUuid: string, conversationUuid: string, memberUuids: string[]) => Promise<ConversationType>;
  removeMembersFromConversation: (userUuid: string, conversationUuid: string, memberUuids: string[]) => Promise<ConversationType>;
  conversationDetails: (userUuid: string, conversationUuid: string) => Promise<ConversationWithMembers>;
}

const createConversationService = ({dataSource}: {dataSource: DataSource}) => {

  const createConveration = async (userUuid: string, data: ConversationFullPostData) => {
    
    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: {uuid: userUuid},
      select: ['id', 'uuid']
    });

    const members = await dataSource.getRepository(User)
      .find({
        select: ['id', 'uuid'],
        where: {uuid: In(data.memberUuids)}
      });

    const ava = await dataSource.createQueryBuilder(Image, 'i')
      .select('i.id, i.uuid, i.path')
      .where('i.uuid = :uuid', { uuid: data.avaUuid })
      .getRawOne();
      
    const chatRoom = dataSource.getRepository(ChatRoom).create();
    await chatRoom.save();

    const conversation = dataSource.getRepository(Conversation).create({
      ownerId: currentUser.id,
      name: data?.name,
      description: data?.description,
      avaId: ava?.id,
      rules: {
        blackList: [],
        whiteList: data.memberUuids?.concat(userUuid)
      },
      chatRoomId: chatRoom.id,
      members: members.concat(currentUser)
    });
    await conversation.save();

    const result: ConversationType = {
      uuid: conversation?.uuid,
      name: conversation?.name,
      description: conversation?.description,
      ownerUuid: userUuid,
      avaPath: ava?.path,
      chatRoomUuid: chatRoom.uuid
    };
    return result;
  };


  const addMembersToConversation = async (userUuid: string, conversationUuid: string, memberUuids: string[]) => {

    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await dataSource.createQueryBuilder(Conversation, 'c')
      .select(`
        c.id, c.uuid, c.name, c.description, 
        i.path AS "avaPath", 
        u.id AS "ownerId", u.uuid AS "ownerUuid",
        r.uuid AS "chatRoomUuid"
      `)
      .where('c.uuid = :uuid', { uuid: conversationUuid })
      .leftJoin('c.ava', 'i')
      .leftJoin('c.owner', 'u')
      .leftJoin('c.chatRoom', 'r')
      .getRawOne();

    if (currentUser.id !== conversationData.ownerId) {
      throw new Error('user is not the owner of the conversation');
    }

    const newMembers = await dataSource.createQueryBuilder(User, 'u')
      .select('u.id, u.uuid')
      .where('u.uuid IN (:...uuids)', { uuids: memberUuids })
      .getRawMany();

    await dataSource.createQueryBuilder()
      .relation(Conversation, 'members')
      .of(conversationData.id)
      .add(newMembers.map(item => item.id));

    const result: ConversationType = {
      uuid: conversationData.uuid,
      name: conversationData?.name,
      ownerUuid: conversationData.ownerUuid,
      description: conversationData?.description,
      avaPath: conversationData?.avaPath,
      chatRoomUuid: conversationData.chatRoomUuid
    };
    return result;      
  };


  const removeMembersFromConversation = async (userUuid: string, conversationUuid: string, memberUuids: string[]) => {

    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await dataSource.createQueryBuilder(Conversation, 'c')
      .select(`
        c.id, c.uuid, c.name, c.description, 
        i.path AS "avaPath", 
        u.id AS "ownerId", u.uuid AS "ownerUuid",
        r.uuid AS "chatRoomUuid"
      `)
      .where('c.uuid = :uuid', { uuid: conversationUuid })
      .leftJoin('c.ava', 'i')
      .leftJoin('c.owner', 'u')
      .leftJoin('c.chatRoom', 'r')
      .getRawOne();

    if (currentUser.id !== conversationData.ownerId) {
      throw new Error('user is not the owner of the conversation');
    }

    if(memberUuids.includes(currentUser.uuid)) {
      throw new Error("the owner can't kick himself");
    }

    const removingMembers = await dataSource.createQueryBuilder(User, 'u')
      .select('u.id, u.uuid')
      .where('u.uuid IN (:...uuids)', { uuids: memberUuids })
      .getRawMany();

    await dataSource.createQueryBuilder()
      .relation(Conversation, 'members')
      .of(conversationData.id)
      .remove(removingMembers.map(item => item.id));

    const result: ConversationType = {
      uuid: conversationData.uuid,
      name: conversationData?.name,
      ownerUuid: conversationData.ownerUuid,
      description: conversationData?.description,
      avaPath: conversationData?.avaPath,
      chatRoomUuid: conversationData.chatRoomUuid
    };
    return result; 
  };

  
  const updateConveration = async (userUuid: string, conversationUuid: string, data: ConversationPostData) => {

    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await dataSource.createQueryBuilder(Conversation, 'c')
      .select(`
        c.id, c.uuid, c.name, c.description, 
        i.path AS "avaPath", 
        u.id AS "ownerId", u.uuid AS "ownerUuid",
        r.uuid AS "chatRoomUuid"
      `)
      .where('c.uuid = :uuid', { uuid: conversationUuid })
      .leftJoin('c.ava', 'i')
      .leftJoin('c.owner', 'u')
      .leftJoin('c.chatRoom', 'r')
      .getRawOne();

    const ava = await dataSource.getRepository(Image)
      .findOne({
        where: {uuid: data.avaUuid },
        select: ['id', 'uuid', 'path']
      });

    if (currentUser.id !== conversationData.ownerId) {
      throw new Error('the user is not the owner of this conversation');
    }

    await dataSource.createQueryBuilder()
      .update(Conversation)
      .set({
        name: data.name,
        description: data.description,
        avaId: ava?.id
      })
      .where('uuid = :uuid', { uuid: conversationUuid })
      .execute();

    
    const result: ConversationType = {
      name: data.name,
      description: data.description,
      avaPath: ava?.path,
      chatRoomUuid: conversationData.chatRoomUuid,
      ownerUuid: conversationData.ownerUuid,
      uuid: conversationData.uuid
    };
    return result;
  };


  const removeConversation = async (userUuid: string, conversationUuid: string) => {
    
    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await dataSource.createQueryBuilder(Conversation, 'c')
      .select(`
        c.id, c.uuid, c.name, c.description, c."avaId" AS "avaId",
        i.path AS "avaPath", 
        u.id AS "ownerId", u.uuid AS "ownerUuid",
        r.uuid AS "chatRoomUuid"
      `)
      .where('c.uuid = :uuid', { uuid: conversationUuid })
      .leftJoin('c.ava', 'i')
      .leftJoin('c.owner', 'u')
      .leftJoin('c.chatRoom', 'r')
      .getRawOne();

    if (currentUser.id !== conversationData.ownerId) {
      throw new Error('the user is not the owner of this conversation');
    }

    const ava = await dataSource.getRepository(Image)
      .findOne({
        where: { id: conversationData.avaId },
        select: ['id', 'uuid', 'path']
      });

    await dataSource.createQueryBuilder()
      .delete()
      .from(Conversation)
      .where('uuid = :uuid', { uuid: conversationUuid })
      .execute();

    const result: ConversationType = {
      uuid: conversationData.uuid,
      name: conversationData.name,
      description: conversationData.description,
      chatRoomUuid: conversationData.chatRoomUuid,
      ownerUuid: conversationData.ownerUuid,
      avaPath: ava?.path
    };
    return result;
  };


  const conversationDetails = async (userUuid: string, conversationUuid: string) => {

    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await dataSource.createQueryBuilder(Conversation, 'c')
      .select(`
        c.id, c.uuid, c.name, c.description, c."avaId" AS "avaId",
        i.path AS "avaPath", 
        u.id AS "ownerId", u.uuid AS "ownerUuid",
        r.uuid AS "chatRoomUuid"
      `)
      .where('c.uuid = :uuid', { uuid: conversationUuid })
      .leftJoin('c.ava', 'i')
      .leftJoin('c.owner', 'u')
      .leftJoin('c.chatRoom', 'r')
      .getRawOne();

    const members = await dataSource.createQueryBuilder(User, 'u')
      .select(`
        u.id, u.uuid, u.name, i.path AS "avaPath"
      `)
      .leftJoin('u.ava', 'i')
      .where((qb) => {
        const subQuery = qb.subQuery()
          .from('conversations_members_users', 'cm')
          .select('cm."usersId"')
          .where('cm."conversationsId" = :conversationId')
          .getQuery();
        return 'u.id IN ' + subQuery;
      })
      .getRawMany();


    if (members.map(item => item.id).includes(currentUser.id)) {
      throw new Error('the user is not the member of this conversation');
    }

    const ava = await dataSource.getRepository(Image)
      .findOne({
        where: { id: conversationData.avaId },
        select: ['id', 'uuid', 'path']
      });

    const result: ConversationWithMembers = {
      uuid: conversationData.uuid,
      name: conversationData.name,
      description: conversationData.description,
      avaPath: ava?.path,
      chatRoomUuid: conversationData.chatRoomUuid,
      ownerUuid: conversationData.ownerUuid,
      members
    };
    return result;
  };


  const conversationsOfUser = async (userUuid: string) => {
    
    const currentUser = await dataSource.getRepository(User).findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversations = await dataSource.createQueryBuilder(Conversation, 'c')
      .select(`
        c.uuid, c.name, c.description, i.path AS "avaPath",
        r.uuid AS "chatRoomUuid", u.uuid AS "ownerUuid"
      `)
      .leftJoin('c.ava', 'i')
      .leftJoin('c.chatRoom', 'r')
      .leftJoin('c.owner','u')
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

    const result: ConversationType[] = conversations.map(item => omitBy(item, isNil)) as ConversationType[];
    return result;
  };


  const service: IConversationService = {
    createConveration,
    addMembersToConversation,
    updateConveration,
    removeMembersFromConversation,
    removeConversation,
    conversationDetails,
    conversationsOfUser
  }
  return service;
}



export default createConversationService;