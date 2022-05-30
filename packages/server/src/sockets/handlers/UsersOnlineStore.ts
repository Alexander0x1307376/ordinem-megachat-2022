import EventEmitter from "events";

export type UserData = {
  uuid?: string;
  socketId: string;
  name: string;
  avaUrl: string;
  friends: string[];
  connectedChannel?: string;
}

export enum UsersStoreEvents {
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',
  USER_JOINED_THE_CHANNEL = 'USER_JOINED_THE_CHANNEL',
  USER_LEFT_THE_CHANNEL = 'USER_LEFT_THE_CHANNEL',
  USER_CHANGED_THE_CHANNEL = 'USER_CHANGED_THE_CHANNEL'
}

class UsersOnlineStore extends EventEmitter {
  
  private userList = new Map<string, UserData>();


  constructor() {
    super();
    this.attachUserToChannel.bind(this);
    this.changeChannelForUser.bind(this);
    this.detachUserFromChannel.bind(this);
    this.addUser.bind(this);
    this.removeUser.bind(this);
    this.addFriendship.bind(this);
    this.removeFriendship.bind(this);
    this.getItem.bind(this);
    this.getList.bind(this);
    this.getSocketId.bind(this);
    this.getUserSocketIdsOfUserFriends.bind(this);
    this.getFriendsData.bind(this);
  }

  // #region каналы
  attachUserToChannel = (userUuid: string, channelUuid: string) => {
    const user = this.userList.get(userUuid);
    if (user) {
      user.connectedChannel = channelUuid;
      this.emit(UsersStoreEvents.USER_JOINED_THE_CHANNEL, {userUuid, channelUuid});
    }
  }
  changeChannelForUser = (userUuid: string, channelUuid: string) => {
    const user = this.userList.get(userUuid);
    if (user) {
      user.connectedChannel = channelUuid;
      this.emit(UsersStoreEvents.USER_CHANGED_THE_CHANNEL, {userUuid, channelUuid});
    }
  }
  detachUserFromChannel = (userUuid: string, channelUuid: string) => {
    const user = this.userList.get(userUuid);
    if (user) {
      user.connectedChannel = undefined;
      this.emit(UsersStoreEvents.USER_LEFT_THE_CHANNEL, {userUuid, channelUuid});
    }
  }

  // #endregion
  
  addUser = (userUuid: string, data: UserData) => {
    this.userList.set(userUuid, data);
    this.emit(UsersStoreEvents.USER_ONLINE, { uuid: userUuid, ...data } as Required<UserData>);
  }

  removeUser = (userUuid: string) => {
    const user = this.userList.get(userUuid);
    this.emit(UsersStoreEvents.USER_OFFLINE, { uuid: userUuid, ...user } as Required<UserData>);
    this.userList.delete(userUuid);
  }

  addFriendship = (userUuid_1: string, userUuid_2: string) => {
    const user_1 = this.userList.get(userUuid_1);
    const user_2 = this.userList.get(userUuid_2);
    if (user_1)
      user_1.friends.push(userUuid_2);
    if (user_2)
      user_2.friends.push(userUuid_1);
  }
  removeFriendship = (userUuid_1: string, userUuid_2: string) => {
    const user_1 = this.userList.get(userUuid_1);
    const user_2 = this.userList.get(userUuid_2);

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
    return this.userList.get(userUuid);
  }

  getList = () => {
    return this.userList;
  }

  getSocketId = (userUuid: string) => {
    return this.userList.get(userUuid)?.socketId;
  }

  getUserSocketIdsOfUserFriends = (userUuid: string) => {
    const friendUuids = this.userList.get(userUuid)?.friends;
    const friendUuidsOnline = friendUuids?.filter(uuid => this.userList.get(uuid));

    const sockets = friendUuidsOnline 
      ? friendUuidsOnline.map(uuid => this.userList.get(uuid)!.socketId) 
      : [];
    return sockets;
  }

  getFriendsData = (userUuid: string) => {
    const friendUuids = this.userList.get(userUuid)?.friends;
    const friendUuidsOnline = friendUuids?.filter(uuid => this.userList.get(uuid));

    const friendsData = friendUuidsOnline?.reduce((acc, item) => {
      acc[item] = { status: 'в сети' };
      return acc;
    }, {} as Record<string, { status: string }>) || {};
    return friendsData;
  }
  

}

export default UsersOnlineStore;