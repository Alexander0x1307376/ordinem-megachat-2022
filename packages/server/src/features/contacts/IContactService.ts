import { Contacts } from "@ordinem-megachat-2022/shared";



export interface IContactService {
  getUserContacts: (userUuid: string) => Promise<Contacts>;
}
