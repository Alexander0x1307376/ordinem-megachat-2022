import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { IChatRoomService } from '../features/chatRoom/IChatRoomService';
import { ChatSocketHandler } from '../features/chatSystem/ChatSocketHandler';
import { ChatRealtimeSystem } from '../features/chatSystem/ChatRealtimeSystem';
import { FriendshipSystemEventEmitter } from '../features/friendshipSystem/FriendshipSystemEventEmitter';
import { IMessageService } from '../features/messages/IMessageService';
import UsersOnlineStore from '../features/usersOnlineStore/UsersOnlineStore';
import { ILogger } from '../logger/ILogger';
import { FriendshipRealtimeSystem } from '../features/friendshipSystem/FriendshipRealtimeSystem';
import { bindAll } from 'lodash';

export class WebSocketMainHandler {
  constructor(
    private socketServer: Server,
    private usersOnlineStore: UsersOnlineStore,
    private logger: ILogger,
    private chatRoomService: IChatRoomService,
    private messageService: IMessageService,
    private friendshipEventEmitter: FriendshipSystemEventEmitter,

  ) {
    bindAll(this, ['init', 'handleConnection']);
  }


  private handleConnection(socket: Socket | any) {
    // извлекаем идентификатор комнаты и имя пользователя
    const { uuid, name, avaUrl, accessToken } = socket.handshake.query;

    this.logger.log(`user ${name} connected!`);

    this.usersOnlineStore.addUser({
      socketId: socket.id,
      uuid,
      userData: { name, avaPath: avaUrl }
    });

    const userData = {
      userUuid: uuid, userName: name, avaPath: avaUrl
    };

    // подключаем обработчики
    const chatSocketHandler = new ChatSocketHandler(
      this.socketServer, 
      socket, 
      this.usersOnlineStore,
      this.chatRoomService, 
      this.messageService, userData
    );
    chatSocketHandler.initHandlers();

    socket.on('disconnect', (reason: any) => {
      this.logger.log(`user ${name} has disconnected`);
      this.usersOnlineStore.removeUser(uuid);
    });
  }

  async init() {
    const chatRealtimeSystem = new ChatRealtimeSystem(
      this.socketServer, this.usersOnlineStore
    );
    const friendshipRealtimeSystem = new FriendshipRealtimeSystem(
      this.socketServer, this.usersOnlineStore, this.friendshipEventEmitter
    );
    chatRealtimeSystem.init();
    friendshipRealtimeSystem.init();

    this.socketServer.on('connection', this.handleConnection);
  }
}