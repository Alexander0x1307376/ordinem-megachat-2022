import { Server, Socket } from "socket.io";
import { IFriendRequestService } from "../features/friendshipSystem/IFriendRequestService";
import { IUserService } from "../features/user/IUserService";
import { IMessageService } from "../features/messages/IMessageService";
import { IChannelService } from "../features/channels/IChannelService";
import FriendshipSystemEventEmitter from "../features/friendshipSystem/friendshipSystemEventEmitter";
import InitFriendshipSystemHandlers from "../features/friendshipSystem/friendshipSystemHandlers";
import UsersOnlineStore from "../features/usersOnlineStore/UsersOnlineStore";
import InitChatSystemHandlers from "../features/chatSystem/chatSystemHandlers";
import { IGroupService } from "../features/group/IGroupService";
import { IChatRoomService } from "../features/chatRoom/IChatRoomService";


interface ICreateMainHandler {
  friendshipEventEmitter: FriendshipSystemEventEmitter;
  usersOnlineStore: UsersOnlineStore;
  friendRequestService: IFriendRequestService;
  userService: IUserService;
  messageService: IMessageService;
  channelService: IChannelService;
  groupService: IGroupService;
  chatRoomService: IChatRoomService;
}

export const CreateMainHandler = (socketServer: Server, {
  usersOnlineStore, 
  friendshipEventEmitter, 
  friendRequestService, 
  userService, 
  messageService,
  channelService,
  groupService,
  chatRoomService
}: ICreateMainHandler) => {

  const friendshipSystemHandlers = InitFriendshipSystemHandlers(socketServer, {
    usersOnlineStore,
    friendRequestService,
    friendshipEventEmitter
  });

  const chatSystemHandlers = InitChatSystemHandlers(socketServer, {
    usersOnlineStore,
    channelService,
    messageService,
    userService,
    groupService,
    chatRoomService
  });


  const mainHandler = async (io: Server, socket: Socket | any) => {
    // извлекаем идентификатор комнаты и имя пользователя
    const { uuid, name, avaUrl, accessToken } = socket.handshake.query;

    console.log(`user ${name} connected!`);

    usersOnlineStore.addUser({
      socketId: socket.id,
      uuid,
      userData: { name, avaPath: avaUrl }
    });

    const userData = {
      userUuid: uuid, userName: name, avaPath: avaUrl
    };

    // подключаем обработчики
    friendshipSystemHandlers(io, socket, userData);
    chatSystemHandlers(io, socket, userData);


    socket.on('disconnect', (reason: any) => {
      console.log(`user ${name} has disconnected`);
      usersOnlineStore.removeUser(uuid);
    });
  }

  socketServer.on('connection', (socket) => mainHandler(socketServer, socket))

}

export default CreateMainHandler;