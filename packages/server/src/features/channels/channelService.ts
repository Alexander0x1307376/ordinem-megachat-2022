import { ChannelItem, ChannelList, ChannelPostData } from "@ordinem-megachat-2022/shared";
import { omit } from "lodash";
import AppDataSource from "../../dataSource";
import { Channel } from "../../entity/Channel";
import { Group } from "../../entity/Group";
import ApiError from "../../exceptions/apiError";

export interface IChannelService {
  getList: (groupUuid: string) => Promise<ChannelList>;
  getChannelDetails: (channelUuid: string) => Promise<ChannelItem>;
  createChannel: (channelPostData: ChannelPostData) => Promise<ChannelItem>;
  updateChannel: (channelUuid: string, channelPostData: ChannelPostData) => Promise<ChannelItem>;
  removeChannel: (channelUuid: string) => Promise<ChannelItem>;
}

const createChannelService = () => {
  
  const getList = async (groupUuid: string): Promise<ChannelList> => {
    const result = await AppDataSource
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
    return {channels: result} as ChannelList;
  }
  
  const getChannelDetails = async (channelUuid: string): Promise<ChannelItem> => {

    const result = await AppDataSource
      .getRepository(Channel)
      .createQueryBuilder()
      .select(['uuid', 'name', 'description', 'createdAt', 'updatedAt'])
      .where({ uuid: channelUuid })
      .getOne();

    if(!result)
      throw ApiError.NotFound();

    return result as ChannelItem;
  }
  
  const createChannel = async ({name, description, groupUuid}: Omit<ChannelPostData, 'uuid'>): Promise<ChannelItem> => {

    const group = await Group.findOne({
      select: ['id'],
      where: { uuid: groupUuid }
    });
    if(!group)
      throw ApiError.BadRequest(`group with uuid ${groupUuid} not found`);

    const channel = Channel.create({
      name, description, groupId: group.id
    });
    await channel.save();

    return omit(channel, ['id']) as ChannelItem;
  }

  const updateChannel = async (
    uuid: string, channelData: Omit<ChannelPostData, 'uuid'>
  ): Promise<ChannelItem> => {
    const channel = await Channel.findOne({where: {uuid}});
    if (!channel)
      throw ApiError.NotFound(`channel with uuid ${uuid} not found`);

    Object.assign(channel, channelData);
    await channel.save();
    return omit(channel, ['id', 'groupId']) as ChannelItem;
  }

  const removeChannel = async (uuid: string) => {
    const channel = await Channel.findOne({ where: { uuid } });
    if (!channel)
      throw ApiError.NotFound(`channel with uuid ${uuid} not found`);
    
    await channel.remove();
    return omit(channel, ['id', 'groupId']) as ChannelItem;
  }

  const result: IChannelService = {
    getList,
    getChannelDetails,
    createChannel,
    updateChannel,
    removeChannel
  };
  return result;
}

export default createChannelService;