import { User } from "./userTypes";

export type Conversation = {
  uuid: string;
  name?: string;
  description?: string;
  avaPath?: string;
  ownerUuid: string;
  chatRoomUuid: string;
}

export type ConversationWithMembers = Conversation & {
  members: User[];
}


export type ConversationPostData = {
  name?: string;
  description?: string;
  avaUuid?: string;
}

export type ConversationFullPostData = {
  name?: string;
  description?: string;
  avaUuid?: string;
  memberUuids: string[];
}