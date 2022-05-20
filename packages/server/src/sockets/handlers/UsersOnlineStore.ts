import EventEmitter from "events";

export type UserData = {
  uuid?: string;
  socketId: string;
  name: string;
  avaUrl: string;
  friends: string[];
}

export enum UsersStoreEvents {
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE'
}

class UsersOnlineStore extends EventEmitter {
  
  private list = new Map<string, UserData>();
  
  addUser = (userUuid: string, data: UserData) => {
    this.list.set(userUuid, data);
    this.emit(UsersStoreEvents.USER_ONLINE, { uuid: userUuid, ...data } as Required<UserData>);
  }

  removeUser = (userUuid: string) => {
    const user = this.list.get(userUuid);
    this.emit(UsersStoreEvents.USER_OFFLINE, { uuid: userUuid, ...user } as Required<UserData>);
    this.list.delete(userUuid);
  }

  getItem = (userUuid: string) => {
    return this.list.get(userUuid);
  }

  getList = () => {
    return this.list;
  }

  getSocketId = (userUuid: string) => {
    return this.list.get(userUuid)?.socketId;
  }

  getUserSocketIdsOfUserFriends = (userUuid: string) => {
    const friendUuids = this.list.get(userUuid)?.friends;
    const friendUuidsOnline = friendUuids?.filter(uuid => this.list.get(uuid));

    const sockets = friendUuidsOnline 
      ? friendUuidsOnline.map(uuid => this.list.get(uuid)!.socketId) 
      : [];
    return sockets;
  }

  getFriendsOnline = (userUuid: string) => {
    console.log('getFriendsOnline', this.list);
    const friendUuids = this.list.get(userUuid)?.friends;
    const friendUuidsOnline = friendUuids?.filter(uuid => this.list.get(uuid));
    return friendUuidsOnline;
  }
}

export default UsersOnlineStore;