import EventEmitter from "events";


export enum EventTypes {
  FRIEND_REQUESTS_IS_CHANGED = 'FRIEND_REQUESTS_ISCHANGED',
  FRIEND_LIST_IS_CHANGED = 'FRIEND_LIST_IS_CHANGED',
  BECAME_FRIENDS = 'BECAME_FRIENDS',
  UNFRIENDED = 'UNFRIENDED'
} 

class FriendshipSystemEventEmitter extends EventEmitter {

  constructor() {
    super();
  }

  friendRequestIsChanged = ({ requesterUuid, requestedUuid }: {requesterUuid: string, requestedUuid: string}) => {
    this.emit(EventTypes.FRIEND_REQUESTS_IS_CHANGED, { requestedUuid, requesterUuid });
  }

  friendsIsChanged = ({ userUuid_1, userUuid_2 }: { userUuid_1: string, userUuid_2: string }) => {
    this.emit(EventTypes.FRIEND_LIST_IS_CHANGED, { userUuid_1, userUuid_2 });
  }
}

export default FriendshipSystemEventEmitter;