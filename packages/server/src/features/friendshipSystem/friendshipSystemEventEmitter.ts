import EventEmitter from "events";


export enum EventTypes {
  FRIEND_LIST_IS_CHANGED = 'FRIEND_LIST_IS_CHANGED',
  BECAME_FRIENDS = 'BECAME_FRIENDS',
  UNFRIENDED = 'UNFRIENDED'
} 

class FriendshipSystemEventEmitter extends EventEmitter {
  friendsIsChanged = (userUuid: string) => {
    this.emit(EventTypes.FRIEND_LIST_IS_CHANGED, { userUuid });
  }

  becameFriends = (userUuid_1: string, userUuid_2: string) => {
    this.emit(EventTypes.BECAME_FRIENDS, { userUuid_1, userUuid_2 });
  }

  unfriended = (userUuid_1: string, userUuid_2: string) => {
    this.emit(EventTypes.UNFRIENDED, { userUuid_1, userUuid_2 });
  }
}

export default FriendshipSystemEventEmitter;