import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../injectableTypes';
import { IChannelService } from './IChannelService';
import ApiError from '../../exceptions/apiError';
import { Channel } from '../../entity/Channel';
import { omit } from 'lodash';
import { Channel as ChannelItem, ChannelList, ChannelPostData } from "@ordinem-megachat-2022/shared";
import { Group } from '../../entity/Group';
import { ChatRoom } from '../../entity/ChatRoom';
import { ChannelEventEmitter } from './ChannelEventEmitter';
import { AppDataSource } from '../../AppDataSource'; 

@injectable()
export class ChannelService implements IChannelService {

  private channelRepository: Repository<Channel>;
  private chatRoomRepository: Repository<ChatRoom>;
  private groupRepository: Repository<Group>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource,
    @inject(TYPES.ChannelEventEmitter) private channelEventEmitter: ChannelEventEmitter
  ) {
    this.dataSource = dataSource.dataSource;

    // const getRep = this.dataSource.getRepository.bind(this.dataSource);
    // this.channelRepository = getRep(Channel)
    // this.chatRoomRepository = getRep(ChatRoom);
    // this.groupRepository = getRep(Group);
    this.channelRepository = this.dataSource.getRepository(Channel)
    this.chatRoomRepository = this.dataSource.getRepository(ChatRoom);
    this.groupRepository = this.dataSource.getRepository(Group);

    this.getList = this.getList.bind(this);
    this.getChannelDetails = this.getChannelDetails.bind(this);
    this.createChannel = this.createChannel.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.removeChannel = this.removeChannel.bind(this);
    this.checkIfChannelExists = this.checkIfChannelExists.bind(this);
  }

  async getList(groupUuid: string): Promise<ChannelList> {
    const result = await this.dataSource
      .createQueryBuilder(Channel, 'c')
      .select('c.uuid, c.name, c.description, c."createdAt", c."updatedAt"')
      .where((qb) => {
        const subQuery = qb.subQuery()
          .select('g.id')
          .from(Group, 'g')
          .where('g.uuid = :groupUuid')
          .getQuery();
        return 'c."groupId" = ' + subQuery;
      })
      .setParameter('groupUuid', groupUuid)
      .getRawMany();

    const channels = result.map(item => ({ ...item, groupUuid }));

    return { channels } as ChannelList;
  }

  async getChannelDetails(channelUuid: string): Promise<ChannelItem> {

    const result = await this.dataSource
      .createQueryBuilder(Channel, 'c')
      .select(`
        c.uuid, c.name, c.description, c."createdAt", 
        c."updatedAt", g.uuid as "groupUuid", r.uuid as "chatRoomUuid"
      `)
      .where('c.uuid = :channelUuid', { channelUuid })
      .leftJoin('c.group', 'g')
      .leftJoin('c.chatRoom', 'r')
      .getRawOne();

    if (!result)
      throw ApiError.NotFound();

    return result as ChannelItem;
  }

  // createChannel = async ({ name, description, groupUuid }: ChannelPostData): Promise<ChannelItem> => {
  async createChannel({ name, description, groupUuid }: ChannelPostData): Promise<ChannelItem> {
    const group = await this.groupRepository.findOne({
      select: ['id'],
      where: { uuid: groupUuid }
    });
    if (!group)
      throw ApiError.BadRequest(`group with uuid ${groupUuid} not found`);

    const chatRoom = this.chatRoomRepository.create();
    // const chatRoom = this.dataSource.getRepository(ChatRoom).create();
    await chatRoom.save();

    const channel = this.channelRepository.create({
      name, description, groupId: group.id, chatRoomId: chatRoom.id
    });
    await channel.save();

    const result: ChannelItem = {
      uuid: channel.uuid,
      name: channel.name,
      description: channel.description,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      chatRoomUuid: chatRoom.uuid,
      groupUuid
    };

    this.channelEventEmitter.emitCreated(result);
    return result;
  }

  async updateChannel(
    uuid: string, channelData: ChannelPostData
  ): Promise<ChannelItem> {
    const channel = await this.channelRepository.findOne({
      where: { uuid },
      relations: { chatRoom: true }
    });
    if (!channel)
      throw ApiError.NotFound(`channel with uuid ${uuid} not found`);

    Object.assign(channel, channelData);
    await channel.save();

    const result: ChannelItem = {
      name: channel.name,
      description: channel.description,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      uuid: channel.uuid,
      groupUuid: channelData.groupUuid,
      chatRoomUuid: channel.chatRoom.uuid,
    };
    
    this.channelEventEmitter.emitUpdated(result);
    return result;
  }

  async removeChannel(channelUuid: string) {

    const channelData = await this.dataSource.createQueryBuilder(Channel, 'c')
      .select('c.id, c.uuid, c.name, c.description, c."createdAt", c."updatedAt", g.uuid as "groupUuid"')
      .where('c.uuid = :channelUuid', { channelUuid })
      .leftJoin('c.group', 'g')
      .getRawOne();

    if (!channelData)
      throw ApiError.NotFound(`channel with uuid ${channelUuid} not found`);

    await this.dataSource.createQueryBuilder()
      .delete()
      .from(Channel)
      .where('id = :channelId', { channelId: channelData.id })
      .execute();

    const result = omit(channelData, ['id']) as ChannelItem;
    this.channelEventEmitter.emitRemoved(result);
    return result;
  }


  async checkIfChannelExists(uuid: string) {
    const channel = await this.channelRepository.findOne({ where: { uuid }, select: ['id'] });
    return !!channel;
  }
}