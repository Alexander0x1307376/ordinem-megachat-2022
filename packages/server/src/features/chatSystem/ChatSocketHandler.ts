import { Server, Socket } from "socket.io";
import { SubscribeToChangeData, ChatSystemEvents as csEvents, MessagePostData, ChangeData, Channel } from "@ordinem-megachat-2022/shared";
import {
  getChatRoomName,
  getGroupRoomName,
  getObserveUserRoomName,
  joinChatRoom,
  joinGroupRoom,
  leaveChatRoom,
  leaveGroupRoom,
  observeUser,
  unobserveUser
} from "./utils";
import UsersOnlineStore, { UserData, UsersStoreEvents as usEvents } from "../usersOnlineStore/UsersOnlineStore"
import { IChatRoomService } from "../chatRoom/IChatRoomService";
import { IMessageService } from "../messages/IMessageService";
import { SocketUserData } from "../../sockets/socketTypes";
import { bindAll } from "lodash";



/**
 * Класс-обработчик web-socket запросов для отдельного пользователя
 */
export class ChatSocketHandler {

  private socketId: string;

  constructor(
    private socketServer: Server, 
    private socket: Socket,
    private usersOnlineStore: UsersOnlineStore,
    private chatRoomService: IChatRoomService,
    private messageService: IMessageService,
    private userData: SocketUserData
  ) {
    // super(socketServer, socket);
    this.socketId = socket.id;

    bindAll(this, [
      'initHandlers',
      'handleSubscribeToChanges',
      'handleUnsubscribeToChanges',
      'handleJoinRoom',
      'handleLeaveRoom',
      'handleRequestChatMessages',
      'handleSendMessage',
    ]);
  }

  initHandlers() {
    this.socket.on(csEvents.SUBSCRIBE_TO_CHANGES, this.handleSubscribeToChanges.bind(this));
    this.socket.on(csEvents.UNSUBSCRIBE_TO_CHANGES, this.handleUnsubscribeToChanges.bind(this));
    this.socket.on(csEvents.JOIN_ROOM, this.handleJoinRoom.bind(this));
    this.socket.on(csEvents.LEAVE_ROOM, this.handleLeaveRoom.bind(this));
    this.socket.on(csEvents.REQUEST_CHAT_MESSAGES, this.handleRequestChatMessages.bind(this));
    this.socket.on(csEvents.SEND_MESSAGE, this.handleSendMessage.bind(this));
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

  private async handleJoinRoom(roomUuid: string) {
    try {
      // проверить существование канала
      const isRoomExist = await this.chatRoomService.checkIfRoomExist(roomUuid);
      if (!isRoomExist) {
        this.socketServer.to(this.socketId).emit(csEvents.JOIN_ROOM_ERROR, {
          message: `room with uuid ${roomUuid} doesn't exist`
        });
        return;
      }
      // присоединение к комнате канала
      // если юзер уже был присоединён к другой комнате - переключить его
      // если юзер уже в комнате - ничего не делать
      const userStoreData = this.usersOnlineStore.getUser(this.userData.userUuid);
      if (!userStoreData)
        throw new Error('Error while joining user to the channel');

      joinChatRoom(this.socket, roomUuid);

      const lastMessages = await this.messageService.getLastMessagesOfRoom(roomUuid);
      this.socketServer.to(this.socketId).emit(csEvents.JOIN_ROOM_SUCCESS, lastMessages);
      console.log(`user ${this.userData.userName} joined channel ${roomUuid}`);
    }
    catch (e: any) {
      console.error(e);
      this.socketServer.to(this.socketId).emit(csEvents.JOIN_ROOM_ERROR, e.message);
    }
  }

  private async handleLeaveRoom(roomUuid: string) {
    const isChannelExists = await this.chatRoomService.checkIfRoomExist(roomUuid);

    if (!isChannelExists) {
      this.socketServer.to(this.socketId).emit(csEvents.LEAVE_ROOM_ERROR, {
        message: `channel with uuid ${roomUuid} doesn't exist`
      });
      return;
    }

    leaveChatRoom(this.socket, roomUuid);

    this.socketServer.to(this.socketId).emit(csEvents.LEAVE_ROOM_SUCCESS);
    console.log(`user ${this.userData.userName} left channel ${roomUuid}`);
  }

  private async handleRequestChatMessages({ chatroomUuid, cursor }: { chatroomUuid: string, cursor: string }) {
    try {
      const messageData = await this.messageService.getMessagesOfRoom(chatroomUuid, cursor, 20);
      this.socketServer.to(this.socketId).emit(csEvents.REQUEST_CHAT_MESSAGES_SUCCESS, messageData);
    }
    catch (e) {
      console.error(e);
      this.socketServer.to(this.socketId).emit(csEvents.REQUEST_CHAT_MESSAGES_ERROR);
    }
  }

  private async handleSendMessage(response: MessagePostData) {
    try {
      const result = await this.messageService.createMessage(this.userData.userUuid, response);

      const chatRoom = getChatRoomName(response.chatRoomUuid);

      // послать сообщение всем, кто сейчас в канале
      this.socketServer.in(chatRoom).emit(csEvents.NEW_MESSAGE, result);
    } catch (e) {
      console.error(e);
      this.socketServer.to(this.socketId).emit(csEvents.SEND_MESSAGE_ERROR, e);
    }
  }
}