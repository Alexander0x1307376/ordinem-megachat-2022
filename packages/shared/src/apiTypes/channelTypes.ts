export type Channel = {
  uuid: string;
  name: string;
  description?: string;
  groupUuid: string;
  chatRoomUuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ChannelList = {
  channels: Channel[];
}

export type ChannelPostData = {
  groupUuid: string;
  name: string;
  description?: string;
}