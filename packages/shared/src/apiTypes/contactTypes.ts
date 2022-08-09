export type Contacts = {
  conversations: {
    uuid: string;
    name?: string;
    description?: string;
    chatRoomUuid: string;
    ownerUuid: string;
  }[];
  directChats: {
    uuid: string;
    chatRoomUuid: string;
    contractor: {
      uuid: string;
      name: string;
      avaPath?: string;
    }
  }[];
}