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

  addFriendship = (userUuid_1: string, userUuid_2: string) => {
    const user_1 = this.list.get(userUuid_1);
    const user_2 = this.list.get(userUuid_2);
    if (user_1)
      user_1.friends.push(userUuid_2);
    if (user_2)
      user_2.friends.push(userUuid_1);
  }
  removeFriendship = (userUuid_1: string, userUuid_2: string) => {
    const user_1 = this.list.get(userUuid_1);
    const user_2 = this.list.get(userUuid_2);

    if(user_1) {
      const friendIndex_1 = user_1?.friends.indexOf(userUuid_2);
      if (friendIndex_1 !== -1)
        user_1.friends.splice(friendIndex_1, 1);
    }
    if(user_2) {
      const friendIndex_2 = user_2?.friends.indexOf(userUuid_1);
      if (friendIndex_2 !== -1)
        user_2.friends.splice(friendIndex_2, 1);
    }
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

  getFriendsData = (userUuid: string) => {
    const friendUuids = this.list.get(userUuid)?.friends;
    const friendUuidsOnline = friendUuids?.filter(uuid => this.list.get(uuid));

    const friendsData = friendUuidsOnline?.reduce((acc, item) => {
      acc[item] = { status: 'в сети' };
      return acc;
    }, {} as Record<string, { status: string }>) || {};
    return friendsData;
  }
  
}

export default UsersOnlineStore;