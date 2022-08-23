import 'reflect-metadata';
import EventEmitter from "events";
import { injectable } from "inversify";


export enum EventTypes {
  FRIEND_REQUESTS_IS_CHANGED = 'FRIEND_REQUESTS_ISCHANGED',
  FRIEND_LIST_IS_CHANGED = 'FRIEND_LIST_IS_CHANGED',
  BECAME_FRIENDS = 'BECAME_FRIENDS',
  UNFRIENDED = 'UNFRIENDED'
}

export type RequesterAndRequestedUuids = { 
  requesterUuid: string; 
  requestedUuid: string 
};
export type TwoUsersUuids = { 
  userUuid_1: string; 
  userUuid_2: string 
};

@injectable()
export class FriendshipSystemEventEmitter extends EventEmitter {

  constructor() {
    super();
  }

  onFriendRequestChanged(callback: (uuids: RequesterAndRequestedUuids) => void) {
    this.on(EventTypes.FRIEND_REQUESTS_IS_CHANGED, callback);
  }
  offFriendRequestChanged(callback: (uuids: RequesterAndRequestedUuids) => void) {
    this.on(EventTypes.FRIEND_REQUESTS_IS_CHANGED, callback);
  }
  emitFriendRequestChanged(uuids: RequesterAndRequestedUuids) {
    this.emit(EventTypes.FRIEND_REQUESTS_IS_CHANGED, uuids);
  }

  onFriendsChanged(callback: (uuids: TwoUsersUuids) => void) {
    this.on(EventTypes.FRIEND_LIST_IS_CHANGED, callback);
  }
  offFriendsChanged(callback: (uuids: TwoUsersUuids) => void) {
    this.on(EventTypes.FRIEND_LIST_IS_CHANGED, callback);
  }
  emitFriendsChanged(uuids: TwoUsersUuids) {
    this.emit(EventTypes.FRIEND_LIST_IS_CHANGED, uuids);
  }
}
