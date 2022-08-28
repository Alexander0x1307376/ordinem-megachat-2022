import { Server, Socket } from "socket.io";
import { ILogger } from "../../logger/ILogger";
import { IChatRoomService } from "../chatRoom/IChatRoomService";
import { IMessageService } from "../messages/IMessageService";
import UsersOnlineStore from "../usersOnlineStore/UsersOnlineStore"
import { SocketUserData } from "../../sockets/socketTypes";
import { bindAll } from "lodash";
import { ChatSystemEvents as csEvents, MessagePostData } from "@ordinem-megachat-2022/shared";
import { getChatRoomName, leaveAllChatRooms, leaveChatRoom, switchChatRoom } from "./utils";
import { BaseSocketHandler } from "../../common/BaseSocketHandler";


export class ChatRoomSocketHandler extends BaseSocketHandler {

  constructor(
    protected socketServer: Server,
    protected socket: Socket,
    protected logger: ILogger,

    protected usersOnlineStore: UsersOnlineStore,
    private chatRoomService: IChatRoomService,
    private messageService: IMessageService,
    private userData: SocketUserData,
  ) {
    super(socketServer, socket, logger, usersOnlineStore);

    bindAll(this, [
      'handleJoinRoom',
      'handleLeaveRoom',
      'handleRequestChatMessages',
      'handleSendMessage',
      'handleLeaveConnectedRooms'
    ]);
  }


  public override initHandlers() {
    this.socket.on(csEvents.JOIN_ROOM, this.handleJoinRoom);
    this.socket.on(csEvents.LEAVE_ROOM, this.handleLeaveRoom);
    this.socket.on(csEvents.LEAVE_ALL_ROOMS, this.handleLeaveConnectedRooms);
    this.socket.on(csEvents.REQUEST_CHAT_MESSAGES, this.handleRequestChatMessages);
    this.socket.on(csEvents.SEND_MESSAGE, this.handleSendMessage);
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
        throw new Error('Error while joining user to the channel: no userStoreData');

      switchChatRoom(this.socket, roomUuid);

      const lastMessages = await this.messageService.getLastMessagesOfRoom(roomUuid);
      this.socketServer.to(this.socketId).emit(csEvents.JOIN_ROOM_SUCCESS, lastMessages);
      this.logger.log(`user ${this.userData.userName} joined channel ${roomUuid}`);
    }
    catch (e: any) {
      this.logger.error(e);
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
    this.logger.log(`user ${this.userData.userName} left channel! ${roomUuid}`);
  }

  private async handleLeaveConnectedRooms() {
    leaveAllChatRooms(this.socket);
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