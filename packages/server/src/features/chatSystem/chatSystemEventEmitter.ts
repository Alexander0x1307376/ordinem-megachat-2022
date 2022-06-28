import { MessageItemResponse } from "@ordinem-megachat-2022/shared";
import EventEmitter from "events";


export enum EventTypes {
  NEW_MESSAGE = 'NEW_MESSAGE',
  DELETED_MESSAGE = 'DELETED_MESSAGE'
}

class ChatSystemEventEmitter extends EventEmitter {
  newMessage = (message: MessageItemResponse) => {
    this.emit(EventTypes.NEW_MESSAGE, message);
  }

  messageWasDeleted = (messageUuid: string) => {
    this.emit(EventTypes.DELETED_MESSAGE, messageUuid);
  }
}

export default ChatSystemEventEmitter;