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
  chatRoomUuid: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageSet = {
  chatRoomUuid: string;
  messages: Record<string, MessageItemResponse>;
  cursors?: {
    prev?: string;
    next?: string;
  };
}

export type MessagePostData = {
  chatRoomUuid: string;
  text: string;
}