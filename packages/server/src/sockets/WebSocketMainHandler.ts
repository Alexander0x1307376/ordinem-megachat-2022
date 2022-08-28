import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { IChatRoomService } from '../features/chatRoom/IChatRoomService';
import { RealtimeSubscriptionsSocketHandler } from '../features/realtimeSystem/RealtimeSubscriptionsSocketHandler';
import { ChatRealtimeSystem } from '../features/realtimeSystem/ChatRealtimeSystem';
import { FriendshipSystemEventEmitter } from '../features/friendshipSystem/FriendshipSystemEventEmitter';
import { IMessageService } from '../features/messages/IMessageService';
import UsersOnlineStore from '../features/usersOnlineStore/UsersOnlineStore';
import { ILogger } from '../logger/ILogger';
import { FriendshipRealtimeSystem } from '../features/friendshipSystem/FriendshipRealtimeSystem';
import { bindAll } from 'lodash';
import { GroupEventEmitter } from '../features/group/GroupEventEmitter';
import { ChannelEventEmitter } from '../features/channels/ChannelEventEmitter';
import { ChatRoomSocketHandler } from '../features/realtimeSystem/ChatRoomSocketHandler';

export class WebSocketMainHandler {
  constructor(
    private socketServer: Server,
    private usersOnlineStore: UsersOnlineStore,
    private logger: ILogger,
    private chatRoomService: IChatRoomService,
    private messageService: IMessageService,
    private friendshipEventEmitter: FriendshipSystemEventEmitter,
    private groupEventEmitter: GroupEventEmitter,
    private channelEventEmitter: ChannelEventEmitter

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
    const subscriptionsSocketHandler = new RealtimeSubscriptionsSocketHandler(
      this.socketServer, 
      socket, 
      this.logger,
      this.usersOnlineStore
    );
    const chatRoomSocketHandler = new ChatRoomSocketHandler(
      this.socketServer,
      socket,
      this.logger,
      this.usersOnlineStore,
      this.chatRoomService,
      this.messageService,
      userData
    );
    subscriptionsSocketHandler.initHandlers();
    chatRoomSocketHandler.initHandlers();

    socket.on('disconnect', (reason: any) => {
      this.logger.log(`user ${name} has disconnected`);
      this.usersOnlineStore.removeUser(uuid);
    });
  }

  async init() {
    const chatRealtimeSystem = new ChatRealtimeSystem(
      this.socketServer, this.usersOnlineStore, this.groupEventEmitter, this.channelEventEmitter
    );
    
    const friendshipRealtimeSystem = new FriendshipRealtimeSystem(
      this.socketServer, this.usersOnlineStore, this.friendshipEventEmitter
    );
    chatRealtimeSystem.init();
    friendshipRealtimeSystem.init();

    this.socketServer.on('connection', this.handleConnection);
  }
}