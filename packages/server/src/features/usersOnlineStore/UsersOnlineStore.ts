import EventEmitter from "events";
import { ChangeData } from "@ordinem-megachat-2022/shared";
import { difference, merge, uniq } from "lodash";

export type UserData = {
  uuid: string;
  socketId: string;
  userData: {
    name: string;
    avaPath: string;
  };
  observables: ChangeData;
}


type ChangeType = Partial<
  Record<keyof ChangeData, 'replace' | 'upsert' | 'remove'>
>;


export enum UsersStoreEvents {
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',
  CHANGE_DATA = 'CHANGE_DATA',
}

/**
 * Тип, указывающий, какие сущности нужно отслеживать. 
 * Данные самих сущностей не используются.
 */
export type OnlineStoreEventData = { data: Partial<ChangeData>, type: ChangeType };

class UsersOnlineStore extends EventEmitter {
  
  private userList = new Map<string, UserData>();

  

  constructor() {
    super();
  }


  setObservableData = (userUuid: string, data: Partial<ChangeData>) => {
    const user = this.userList.get(userUuid);
    if (!user) return;
    user.observables = merge(user.observables, data);
  }

  unsetObservableData = (userUuid: string, data: Partial<ChangeData>) => {
    const user = this.userList.get(userUuid);
    if (!user) return;

    user.observables.channels = difference(user.observables.channels, data.channels || []);
    user.observables.groups = difference(user.observables.groups, data.groups || []);
    user.observables.users = difference(user.observables.users, data.users || []);
  }

  setGroups = (userUuid: string, groupUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;

    const data = uniq(groupUuids);
    user.observables.groups = data;
    
    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { groups: data },
      type: { groups: 'replace'}
    });
  }

  upsertGroups = (userUuid: string, groupUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;
    const groups = user.observables.groups;
    
    const data = uniq(groups.concat(groupUuids));
    user.observables.groups = data;

    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { groups: data },
      type: { groups: 'upsert' }
    });
  }

  removeGroups = (userUuid: string, groupUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;
    const groups = user.observables.groups;

    const data = difference(groups, groupUuids);
    user.observables.groups = data;

    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { groups: data },
      type: { groups: 'remove' }
    });
  }



  setChannels = (userUuid: string, channelUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;

    const data = uniq(channelUuids);
    user.observables.channels = data;
    
    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { channels: data },
      type: { channels: 'replace'}
    });
  }

  upsertChannels = (userUuid: string, channelUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;
    const channels = user.observables.channels;
    
    const data = uniq(channels.concat(channelUuids));
    user.observables.channels = data;

    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { channels: data },
      type: { channels: 'upsert' }
    });
  }

  removeChannels = (userUuid: string, channelUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;
    const channels = user.observables.channels;

    const data = difference(channels, channelUuids);
    user.observables.channels = data;

    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { channels: data },
      type: { channels: 'remove' }
    });
  }



  setObservableUsers = (userUuid: string, userUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;

    const data = uniq(userUuids);
    user.observables.users = data;
    
    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { users: data },
      type: { users: 'replace'}
    });
  }

  upsertObservableUsers = (userUuid: string, userUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;
    const users = user.observables.users;
    
    const data = uniq(users.concat(userUuids));
    user.observables.users = data;

    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { users: data },
      type: { users: 'upsert' }
    });
  }

  removeObservableUsers = (userUuid: string, userUuids: string[]) => {
    const user = this.userList.get(userUuid);
    if (!user) return;
    const users = user.observables.users;

    const data = difference(users, userUuids);
    user.observables.users = data;

    this.emitEvent(UsersStoreEvents.CHANGE_DATA, {
      data: { users: data },
      type: { users: 'remove' }
    });
  }


  addUser = (data: Pick<UserData, 'uuid' | 'socketId' | 'userData'> & Partial<UserData>) => {
    this.userList.set(data.uuid, {
      uuid: data.uuid,
      socketId: data.socketId,
      userData: data.userData,
      observables: {
        channels: data.observables?.channels || [],
        groups: data.observables?.groups || [],
        users: data.observables?.users || []
      }
    });
    this.emit(UsersStoreEvents.USER_ONLINE, data as UserData);
  }

  removeUser = (userUuid: string) => {
    const user = this.userList.get(userUuid);
    this.emit(UsersStoreEvents.USER_OFFLINE, user as UserData);
    this.userList.delete(userUuid);
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

  private emitEvent = (event: UsersStoreEvents, data: OnlineStoreEventData) => {
    this.emit(event, data);
  }
}


export default UsersOnlineStore;