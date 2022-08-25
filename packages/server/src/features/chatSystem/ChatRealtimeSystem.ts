import { Server } from "socket.io"
import UsersOnlineStore, { UserData } from "../usersOnlineStore/UsersOnlineStore"
import { ChangeData, ChatSystemEvents as csEvents, GroupResponse } from "@ordinem-megachat-2022/shared";
import {
  getChatRoomName,
  getGroupRoomName,
  getObserveUserRoomName} from "./utils";
import { BaseRealtimeSystem } from "../../common/BaseRealtimeSystem";
import { GroupEventEmitter } from "../group/GroupEventEmitter";
import { ChannelEventEmitter } from "../channels/ChannelEventEmitter";
import { Channel as ChannelItem } from "@ordinem-megachat-2022/shared";


export class ChatRealtimeSystem extends BaseRealtimeSystem {

  constructor(
    protected socketServer: Server,
    protected usersOnlineStore: UsersOnlineStore,
    protected groupEventEmitter: GroupEventEmitter,
    protected channelEventEmitter: ChannelEventEmitter
    
  ) {
    super(socketServer);
  }
  
  init() {

    this.usersOnlineStore.onUserOnline(this.handleUserOnline.bind(this));
    this.usersOnlineStore.onUserOffline(this.handleUserOffline.bind(this));

    this.handleGroupDataChanged = this.handleGroupDataChanged.bind(this);
    this.groupEventEmitter.onCreated(this.handleGroupDataChanged);
    this.groupEventEmitter.onUpdated(this.handleGroupDataChanged);
    this.groupEventEmitter.onRemoved(this.handleGroupDataChanged);
    
    this.handleChannelDataChanged = this.handleChannelDataChanged.bind(this);
    this.channelEventEmitter.onCreated(this.handleChannelDataChanged);
    this.channelEventEmitter.onUpdated(this.handleChannelDataChanged);
    this.channelEventEmitter.onRemoved(this.handleChannelDataChanged);
  }

  private async handleGroupDataChanged(data: GroupResponse) {
    const groupRoom = getGroupRoomName(data.uuid);
    this.socketServer.in(groupRoom).emit(csEvents.CHANGES_SIGNAL, 'group.list');
  }

  private async handleChannelDataChanged(data: ChannelItem) {
    const groupRoom = getGroupRoomName(data.groupUuid);
    this.socketServer.in(groupRoom).emit(csEvents.CHANGES_SIGNAL, 'group.channels');
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