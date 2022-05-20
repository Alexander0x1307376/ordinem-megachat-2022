import { Server, Socket } from "socket.io";
import { IFriendRequestService } from "../features/friendshipSystem/friendRequestService";
import FriendshipSystemEventEmitter from "../features/friendshipSystem/friendshipSystemEventEmitter";
import { IUserService } from "../features/user/userService";
import InitFriendshipSystemHandlers from "./handlers/friendshipSystemHandlers";
import UsersOnlineStore from "./handlers/UsersOnlineStore";


export const CreateMainHandler = (socketServer: Server, {
  usersOnlineStore, friendshipEventEmitter, friendRequestService, userService
}: {
  friendshipEventEmitter: FriendshipSystemEventEmitter;
  usersOnlineStore: UsersOnlineStore;
  friendRequestService: IFriendRequestService;
  userService: IUserService;
}) => {

  const friendshipSystemHandlers = InitFriendshipSystemHandlers(socketServer, {
    usersOnlineStore,
    friendRequestService,
    friendshipEventEmitter
  });


  const mainHandler = async (io: Server, socket: Socket | any) => {
    // извлекаем идентификатор комнаты и имя пользователя
    const { uuid, name, avaUrl, accessToken } = socket.handshake.query;

    console.log(`user ${name} connected!`);

    const userFriends = await userService.friends(uuid);

    usersOnlineStore.addUser(uuid, {
      socketId: socket.id,
      name,
      avaUrl,
      friends: userFriends.map((item: any) => item.uuid)
    });


    socket.userName = name;
    socket.userUuid = uuid;

    friendshipSystemHandlers(io, socket);

    socket.on('disconnect', (reason: any) => {
      console.log(`user ${name} has disconnected`);
      usersOnlineStore.removeUser(uuid);
    });
  }

  socketServer.on('connection', (socket) => mainHandler(socketServer, socket))

}

export default CreateMainHandler;