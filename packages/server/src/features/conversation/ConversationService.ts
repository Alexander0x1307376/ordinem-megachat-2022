import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { DataSource, In, Repository } from "typeorm";
import { ChatRoom } from "../../entity/ChatRoom";
import { Conversation } from "../../entity/Conversation";
import { Image } from "../../entity/Image";
import { User } from "../../entity/User";
import { TYPES } from "../../injectableTypes";
import { IConversationService } from "./IConversationService";
import { ConversationPostData, Conversation as ConversationType, ConversationWithMembers, ConversationFullPostData } from "@ordinem-megachat-2022/shared";
import { isNil, omitBy } from 'lodash';
import { AppDataSource } from '../../AppDataSource'; 


@injectable()
export class ConversationService implements IConversationService {

  private userRepository: Repository<User>;
  private chatRoomRepository: Repository<ChatRoom>;
  private conversationRepository: Repository<Conversation>;
  private imageRepository: Repository<Image>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource
  ) {
    this.dataSource = dataSource.dataSource;
    this.userRepository = this.dataSource.getRepository(User);
    this.chatRoomRepository = this.dataSource.getRepository(ChatRoom);
    this.imageRepository = this.dataSource.getRepository(Image);
    this.conversationRepository = this.dataSource.getRepository(Conversation);
  }

  async createConveration(userUuid: string, data: ConversationFullPostData) {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const members = await this.userRepository
      .find({
        select: ['id', 'uuid'],
        where: { uuid: In(data.memberUuids) }
      });

    const ava = await this.dataSource.createQueryBuilder(Image, 'i')
      .select('i.id, i.uuid, i.path')
      .where('i.uuid = :uuid', { uuid: data.avaUuid })
      .getRawOne();

    const chatRoom = this.chatRoomRepository.create();
    await chatRoom.save();

    const conversation = this.conversationRepository.create({
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


  async addMembersToConversation(userUuid: string, conversationUuid: string, memberUuids: string[]) {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await this.dataSource.createQueryBuilder(Conversation, 'c')
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

    const newMembers = await this.dataSource.createQueryBuilder(User, 'u')
      .select('u.id, u.uuid')
      .where('u.uuid IN (:...uuids)', { uuids: memberUuids })
      .getRawMany();

    await this.dataSource.createQueryBuilder()
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


  async removeMembersFromConversation(userUuid: string, conversationUuid: string, memberUuids: string[]) {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await this.dataSource.createQueryBuilder(Conversation, 'c')
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

    if (memberUuids.includes(currentUser.uuid)) {
      throw new Error("the owner can't kick himself");
    }

    const removingMembers = await this.dataSource.createQueryBuilder(User, 'u')
      .select('u.id, u.uuid')
      .where('u.uuid IN (:...uuids)', { uuids: memberUuids })
      .getRawMany();

    await this.dataSource.createQueryBuilder()
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


  async updateConveration(userUuid: string, conversationUuid: string, data: ConversationPostData) {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await this.dataSource.createQueryBuilder(Conversation, 'c')
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

    const ava = await this.imageRepository
      .findOne({
        where: { uuid: data.avaUuid },
        select: ['id', 'uuid', 'path']
      });

    if (currentUser.id !== conversationData.ownerId) {
      throw new Error('the user is not the owner of this conversation');
    }

    await this.dataSource.createQueryBuilder()
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


  async removeConversation(userUuid: string, conversationUuid: string) {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await this.dataSource.createQueryBuilder(Conversation, 'c')
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

    const ava = await this.dataSource.getRepository(Image)
      .findOne({
        where: { id: conversationData.avaId },
        select: ['id', 'uuid', 'path']
      });

    await this.dataSource.createQueryBuilder()
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


  async conversationDetails(userUuid: string, conversationUuid: string) {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

    const conversationData = await this.dataSource.createQueryBuilder(Conversation, 'c')
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

    const members = await this.dataSource.createQueryBuilder(User, 'u')
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

    const ava = await this.imageRepository
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


  async conversationsOfUser(userUuid: string) {

    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      select: ['id', 'uuid']
    });

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

    const result: ConversationType[] = conversations.map(item => omitBy(item, isNil)) as ConversationType[];
    return result;
  };
}