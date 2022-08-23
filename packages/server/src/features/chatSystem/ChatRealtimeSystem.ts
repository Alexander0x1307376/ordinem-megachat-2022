import { Server } from "socket.io"
import UsersOnlineStore, { UserData } from "../usersOnlineStore/UsersOnlineStore"
import { ChatSystemEvents as csEvents } from "@ordinem-megachat-2022/shared";
import {
  getObserveUserRoomName} from "./utils";
import { BaseRealtimeSystem } from "../../common/BaseRealtimeSystem";


export class ChatRealtimeSystem extends BaseRealtimeSystem {

  constructor(
    protected socketServer: Server,
    protected usersOnlineStore: UsersOnlineStore
  ) {
    super(socketServer);
  }
  
  init() {
    this.usersOnlineStore.onUserOnline(this.handleUserOnline.bind(this));
    this.usersOnlineStore.onUserOffline(this.handleUserOffline.bind(this));
  }


  private async handleUserOnline(userData: UserData) {
    const observeUserRoom = getObserveUserRoomName(userData.uuid);
    this.socketServer.in(observeUserRoom).emit(csEvents.USER_ONLINE, userData.uuid);
  }

  private async handleUserOffline(userData: UserData) {
    const observeUserRoom = getObserveUserRoomName(userData.uuid);
    this.socketServer.in(observeUserRoom).emit(csEvents.USER_OFFLINE, userData.uuid);
  }
}