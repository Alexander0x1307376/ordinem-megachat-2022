export type ChannelItem = {
  uuid: string;
  name: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type ChannelList = {
  channels: ChannelItem[];
}

export type ChannelPostData = {
  groupUuid: string;
  name: string;
  description?: string;
}