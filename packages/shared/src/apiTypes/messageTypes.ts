export type Message = {
  uuid: string;
  text: string;
  authorUuid: string;
  channelUuid: string;
  authorAvaPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageItemResponse = {
  id: number;
  uuid: string;
  text: string;
  authorUuid: string;
  authorName: string;
  authorAvaPath?: string;
  channelUuid: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageSet = {
  channelUuid: string;
  messages: Record<string, MessageItemResponse>;
  cursors?: {
    prev?: string;
    next?: string;
  };
}

export type MessagePostData = {
  channelUuid: string;
  text: string;
}