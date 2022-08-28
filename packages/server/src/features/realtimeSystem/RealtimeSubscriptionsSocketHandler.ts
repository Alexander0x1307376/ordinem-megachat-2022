import { Server, Socket } from "socket.io";
import { SubscribeToChangeData, ChatSystemEvents as csEvents, MessagePostData, ChangeData, Channel } from "@ordinem-megachat-2022/shared";
import {
  getChatRoomName,
  getGroupRoomName,
  getObserveUserRoomName,
  joinChatRoom,
  joinGroupRoom,
  leaveAllChatRooms,
  leaveChatRoom,
  leaveGroupRoom,
  observeUser,
  switchChatRoom,
  unobserveUser
} from "./utils";
import UsersOnlineStore, { UserData, UsersStoreEvents as usEvents } from "../usersOnlineStore/UsersOnlineStore"
import { IChatRoomService } from "../chatRoom/IChatRoomService";
import { IMessageService } from "../messages/IMessageService";
import { SocketUserData } from "../../sockets/socketTypes";
import { bindAll } from "lodash";
import { ILogger } from "../../logger/ILogger";
import { BaseSocketHandler } from "../../common/BaseSocketHandler";



/**
 * Класс-обработчик web-socket запросов для отдельного пользователя.
 * Отвечает за подписку/отписку на изменения сущностей
 */
export class RealtimeSubscriptionsSocketHandler extends BaseSocketHandler {

  constructor(
    protected socketServer: Server, 
    protected socket: Socket,
    protected logger: ILogger,
    protected usersOnlineStore: UsersOnlineStore,
  ) {
    super(socketServer, socket, logger, usersOnlineStore);

    bindAll(this, [
      'handleSubscribeToChanges',
      'handleUnsubscribeToChanges',
    ]);
  }

  public override initHandlers() {
    this.socket.on(csEvents.SUBSCRIBE_TO_CHANGES, this.handleSubscribeToChanges);
    this.socket.on(csEvents.UNSUBSCRIBE_TO_CHANGES, this.handleUnsubscribeToChanges);
  }

  private async handleSubscribeToChanges(data: Partial<SubscribeToChangeData>) {
    try {
      data.groups?.forEach(item => joinGroupRoom(this.socket, item));
      data.rooms?.forEach(item => joinChatRoom(this.socket, item));
      data.users?.forEach(item => observeUser(this.socket, item));
      // собираем актуальные данные реального времени 
      const storeUsers = this.usersOnlineStore.getList();
      const usersOnline = data.users
        ?.filter((item: string) => storeUsers.has(item))
        .map(item => ({ uuid: item, status: 'в сети' })) || [];

      const result: ChangeData = {
        users: {
          data: usersOnline,
          changeType: 'replace'
        }
      };

      this.socket.emit(csEvents.CHANGES, result);

    } catch (e: any) {
      console.error(e.message);
    }
  }

  private async handleUnsubscribeToChanges(data: Partial<SubscribeToChangeData>) {
    data.groups?.forEach(item => {
      leaveGroupRoom(this.socket, item);
    });
    data.rooms?.forEach(item => {
      leaveChatRoom(this.socket, item);
    });
    data.users?.forEach(item => {
      unobserveUser(this.socket, item);
    });

  }
}