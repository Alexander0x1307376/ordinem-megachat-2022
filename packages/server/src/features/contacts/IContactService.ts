import { Contacts, DirectChat as DirectChatType } from "@ordinem-megachat-2022/shared";



export interface IContactService {
  getUserContacts: (userUuid: string) => Promise<Contacts>;
  getContact: (userUuid: string, contactUuid: string) => Promise<DirectChatType>;
}
