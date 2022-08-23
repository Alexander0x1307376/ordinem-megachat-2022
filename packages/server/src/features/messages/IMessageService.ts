import { MessageItemResponse, MessagePostData, MessageSet } from "@ordinem-megachat-2022/shared";



export interface IMessageService {
  getMessagesOfRoom: (roomUuid: string, cursor: string, count?: number) => Promise<MessageSet>;
  getLastMessagesOfRoom: (roomUuid: string, count?: number) => Promise<MessageSet>;
  createMessage: (authorUuid: string, messageData: MessagePostData) => Promise<MessageItemResponse>;
}
