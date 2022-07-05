import { Channel as ChannelItem, ChannelList, ChannelPostData } from "@ordinem-megachat-2022/shared";
import { omit } from "lodash";
import { Channel } from "../../entity/Channel";
import { Group } from "../../entity/Group";
import ApiError from "../../exceptions/apiError";
import { DataSource } from "typeorm";
import createChangeDataEventEmitter, { ChangeDataEventEmitter } from "../crudService/changeDataEventEmitter";


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
    return {channels: result} as ChannelList;
  }
  
  const getChannelDetails = async (channelUuid: string): Promise<ChannelItem> => {

    const result = await dataSource
      .getRepository(Channel)
      .createQueryBuilder()
      .select(['uuid', 'name', 'description', 'createdAt', 'updatedAt'])
      .where({ uuid: channelUuid })
      .getOne();

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

    const channel = Channel.create({
      name, description, groupId: group.id
    });
    await channel.save();

    return omit(channel, ['id']) as ChannelItem;
  }

  const updateChannel = async (
    uuid: string, channelData: ChannelPostData
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
    on: eventEmitter.on,
    off: eventEmitter.off
  };
  return result;
}

export default createChannelService;