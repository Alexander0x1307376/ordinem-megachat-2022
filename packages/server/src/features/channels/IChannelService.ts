import { Channel as ChannelItem, ChannelList, ChannelPostData } from "@ordinem-megachat-2022/shared";


// export interface IChannelService extends ChangeDataEventEmitter<ChannelItem> {
export interface IChannelService {
  getList: (groupUuid: string) => Promise<ChannelList>;
  getChannelDetails: (channelUuid: string) => Promise<ChannelItem>;
  createChannel: (channelPostData: ChannelPostData) => Promise<ChannelItem>;
  updateChannel: (channelUuid: string, channelPostData: ChannelPostData) => Promise<ChannelItem>;
  removeChannel: (channelUuid: string) => Promise<ChannelItem>;
  checkIfChannelExists: (channelUuid: string) => Promise<boolean>;
}
