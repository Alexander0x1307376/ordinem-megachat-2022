import EventEmitter from "events";
import { SubscribeToChangeData } from "@ordinem-megachat-2022/shared";

export type UserData = {
  uuid: string;
  socketId: string;
  userData: {
    name: string;
    avaPath: string;
  }
}


type ChangeType = Partial<
  Record<keyof SubscribeToChangeData, 'replace' | 'upsert' | 'remove'>
>;


export enum UsersStoreEvents {
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE'
}

/**
 * Тип, указывающий, какие сущности нужно отслеживать. 
 * Данные самих сущностей не используются.
 */
export type OnlineStoreEventData = { data: Partial<SubscribeToChangeData>, type: ChangeType };

class UsersOnlineStore extends EventEmitter {
  
  private userList = new Map<string, UserData>();


  constructor() {
    super();
  }


  addUser = (data: UserData) => {
    this.userList.set(data.uuid, {
      uuid: data.uuid,
      socketId: data.socketId,
      userData: data.userData
    });
    this.emit(UsersStoreEvents.USER_ONLINE, data as UserData);
  }

  removeUser = (userUuid: string) => {
    const user = this.userList.get(userUuid);
    this.emit(UsersStoreEvents.USER_OFFLINE, user as UserData);
    this.userList.delete(userUuid);
  }


  getUser = (userUuid: string) => {
    return this.userList.get(userUuid);
  }

  getList = () => {
    return this.userList;
  }

  getSocketId = (userUuid: string) => {
    return this.userList.get(userUuid)?.socketId;
  }
}


export default UsersOnlineStore;