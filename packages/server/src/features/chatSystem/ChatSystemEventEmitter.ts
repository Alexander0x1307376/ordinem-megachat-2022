import 'reflect-metadata';
import { MessageItemResponse } from "@ordinem-megachat-2022/shared";
import EventEmitter from "events";
import { injectable } from "inversify";


export enum EventTypes {
  NEW_MESSAGE = 'NEW_MESSAGE',
  DELETED_MESSAGE = 'DELETED_MESSAGE'
}

@injectable()
class ChatSystemEventEmitter extends EventEmitter {


  onNewMessage(callback: (message: MessageItemResponse) => void) {
    this.on(EventTypes.NEW_MESSAGE, callback)
  }

  onMessageWasDeleted(callback: (messageUuid: string) => void) {
    this.on(EventTypes.DELETED_MESSAGE, callback);
  }
  
  offNewMessage(callback: (message: MessageItemResponse) => void) {
    this.off(EventTypes.NEW_MESSAGE, callback);
  }

  offMessageWasDeleted(callback: (messageUuid: string) => void) {
    this.off(EventTypes.DELETED_MESSAGE, callback);
  }

  emitNewMessage(message: MessageItemResponse) {
    this.emit(EventTypes.NEW_MESSAGE, message);
  }
  
  emitMessageWasDeleted(messageUuid: string) {
    this.emit(EventTypes.DELETED_MESSAGE, messageUuid);
  }




  newMessage(message: MessageItemResponse) {
    this.emit(EventTypes.NEW_MESSAGE, message);
  }

  messageWasDeleted(messageUuid: string) {
    this.emit(EventTypes.DELETED_MESSAGE, messageUuid);
  }
}

export default ChatSystemEventEmitter;