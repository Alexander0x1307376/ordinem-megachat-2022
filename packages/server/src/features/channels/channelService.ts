import { Channel as ChannelItem, ChannelList, ChannelPostData } from "@ordinem-megachat-2022/shared";
import { omit } from "lodash";
import { Channel } from "../../entity/Channel";
import { Group } from "../../entity/Group";
import ApiError from "../../exceptions/apiError";
import { DataSource } from "typeorm";
import createChangeDataEventEmitter, { ChangeDataEventEmitter } from "../crudService/changeDataEventEmitter";
import { ChatRoom } from "../../entity/ChatRoom";


export interface IChannelService extends ChangeDataEventEmitter<ChannelItem> {
  getList: (groupUuid: string) => Promise<ChannelList>;
  getChannelDetails: (channelUuid: string) => Promise<ChannelItem>;
  createChannel: (channelPostData: ChannelPostData) => Promise<ChannelItem>;
  updateChannel: (channelUuid: string, channelPostData: ChannelPostData) => Promise<ChannelItem>;
  removeChannel: (channelUuid: string) => Promise<ChannelItem>;
  checkIfChannelExists: (channelUuid: string) => Promise<boolean>;
}

const createChannelService = ({
  dataSource
}: { 
  dataSource: DataSource 
}) => {
  
  const getList = async (groupUuid: string): Promise<ChannelList> => {
    const result = await dataSource
      .getRepository(Channel)
      .createQueryBuilder('c')
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

    const channels = result.map(item => ({...item, groupUuid}));
    
    return { channels } as ChannelList;
  }
  
  const getChannelDetails = async (channelUuid: string): Promise<ChannelItem> => {

    const result = await dataSource
      .createQueryBuilder(Channel, 'c')
      .select(`
        c.uuid, c.name, c.description, c."createdAt", 
        c."updatedAt", g.uuid as "groupUuid", r.uuid as "chatRoomUuid"
      `)
      .where('c.uuid = :channelUuid', { channelUuid })
      .leftJoin('c.group', 'g')
      .leftJoin('c.chatRoom', 'r')
      .getRawOne();

    if(!result)
      throw ApiError.NotFound();

    return result as ChannelItem;
  }
  
  const createChannel = async ({name, description, groupUuid}: ChannelPostData): Promise<ChannelItem> => {

    const group = await Group.findOne({
      select: ['id'],
      where: { uuid: groupUuid }
    });
    if(!group)
      throw ApiError.BadRequest(`group with uuid ${groupUuid} not found`);

    const chatRoom = dataSource.getRepository(ChatRoom).create();
    await chatRoom.save();

    const channel = dataSource.getRepository(Channel).create({
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
    return result;
  }

  const updateChannel = async (
    uuid: string, channelData: ChannelPostData
  ): Promise<ChannelItem> => {
    const channel = await dataSource.getRepository(Channel).findOne({
      where: {uuid},
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
      uuid: channel.name,
      groupUuid: channelData.groupUuid,
      chatRoomUuid: channel.chatRoom.uuid,
    };
    return result;
  }

  const removeChannel = async (channelUuid: string) => {
    
    const channelData = await dataSource.createQueryBuilder(Channel, 'c')
      .select('c.id, c.uuid, c.name, c.description, c."createdAt", c."updatedAt", g.uuid as "groupUuid"')
      .where('c.uuid = :channelUuid', { channelUuid })
      .leftJoin('c.group', 'g')
      .getRawOne();

    if (!channelData)
      throw ApiError.NotFound(`channel with uuid ${channelUuid} not found`);

    await dataSource.createQueryBuilder()
      .delete()
      .from(Channel)
      .where('id = :channelId', {channelId: channelData.id})
      .execute();    
    
    return omit(channelData, ['id']) as ChannelItem;
  }


  const checkIfChannelExists = async (uuid: string) => {
    const channel = await Channel.findOne({where: { uuid }, select: ['id']});
    return !!channel;
  }

  const eventEmitter = createChangeDataEventEmitter<ChannelItem>({
    methods: {
      create: createChannel,
      update: updateChannel,
      remove: removeChannel
    }
  })

  const result: IChannelService = {
    createChannel: eventEmitter.create,
    updateChannel: eventEmitter.update,
    removeChannel: eventEmitter.remove,
    getList,
    getChannelDetails,
    checkIfChannelExists,
    ...eventEmitter.emitter
  };
  return result;
}

export default createChannelService;