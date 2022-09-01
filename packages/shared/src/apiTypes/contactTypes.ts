export type Contacts = {
  conversations: {
    uuid: string;
    name?: string;
    description?: string;
    chatRoomUuid: string;
    ownerUuid: string;
  }[];
  directChats: DirectChat[];
}

export type DirectChat = {
  uuid: string;
  chatRoomUuid: string;
  contactor: {
    uuid: string;
    name: string;
    avaPath?: string;
  }
}