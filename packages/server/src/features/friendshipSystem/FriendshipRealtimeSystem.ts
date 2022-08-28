import { inject, injectable } from "inversify";
import { Server } from "socket.io";
import { TYPES } from "../../injectableTypes";
import { FriendshipSystemEventEmitter, RequesterAndRequestedUuids, TwoUsersUuids } from "./FriendshipSystemEventEmitter";
import { RequestsInfo, FriendshipSystemEvents as fsEvents } from "@ordinem-megachat-2022/shared";
import UsersOnlineStore from "../usersOnlineStore/UsersOnlineStore";
import { BaseRealtimeSystem } from "../../common/BaseRealtimeSystem";


/**
 * FriendshipRealtimeSystem принимает события о запросах дружбы от 
 * "внутреннего" эмиттера FriendshipSystemEventEmitter
 * и отсылает их пользователям, которых это касается (пользователей берёт из usersOnlineStore)
 */
export class FriendshipRealtimeSystem extends BaseRealtimeSystem {
  constructor(
    protected socketServer: Server,
    protected usersOnlineStore: UsersOnlineStore,
    protected friendshipEventEmitter: FriendshipSystemEventEmitter
  ) {
    super(socketServer);
  }
  
  init() {
    this.friendshipEventEmitter.onFriendRequestChanged(this.handleFriendRequestsIsChanged.bind(this));
    this.friendshipEventEmitter.onFriendsChanged(this.handleFriendListIsChanged.bind(this));
  }

  private handleFriendRequestsIsChanged(uuids: RequesterAndRequestedUuids): void {
    const user_1 = this.usersOnlineStore.getUser(uuids.requesterUuid);
    const user_2 = this.usersOnlineStore.getUser(uuids.requestedUuid);

    if (user_1) {
      this.socketServer.to(user_1.socketId).emit(fsEvents.FRIEND_REQUESTS_UPDATED);
    }
    if (user_2) {
      this.socketServer.to(user_2.socketId).emit(fsEvents.FRIEND_REQUESTS_UPDATED);
    }
  } 

  private handleFriendListIsChanged(uuids: TwoUsersUuids): void {
    const user_1 = this.usersOnlineStore.getUser(uuids.userUuid_1);
    const user_2 = this.usersOnlineStore.getUser(uuids.userUuid_2);

    if (user_1) {
      this.socketServer.to(user_1.socketId).emit(fsEvents.FRIEND_STATUSES);
    }
    if (user_2) {
      this.socketServer.to(user_2.socketId).emit(fsEvents.FRIEND_STATUSES);
    }
  }
}