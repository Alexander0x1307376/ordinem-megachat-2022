import { Server, Socket } from "socket.io";
import { IFriendRequestService } from "../../features/friendshipSystem/friendRequestService";
import { RequestsInfo, MessageSystemEvents as msEvents } from "@ordinem-megachat-2022/shared";
import FriendshipSystemEventEmitter, {EventTypes as fsEventTypes} from "../../features/friendshipSystem/friendshipSystemEventEmitter";
import UsersOnlineStore, { UserData, UsersStoreEvents } from "./UsersOnlineStore";



const InitFriendshipSystemHandlers = (
  io: Server, { 
    usersOnlineStore, friendshipEventEmitter, friendRequestService 
  } : { 
    usersOnlineStore: UsersOnlineStore, 
    friendshipEventEmitter: FriendshipSystemEventEmitter,
    friendRequestService: IFriendRequestService
  }
) => {

  const friendshipSystemHandlers = (io: Server, socket: Socket | any) => {
    // извлекаем идентификатор комнаты
    const { userUuid, id: socketId } = socket;

    // запрос информации о реквестах и статусе друзей при подключении
    socket.on(msEvents.REQUEST_INFO, async () => {

      try {
        const result: RequestsInfo = {
          friendRequests: await friendRequestService.getRequests(userUuid),
          friendsStatuses: usersOnlineStore.getFriendsOnline(userUuid)?.reduce((acc, item) => {
            acc[item] = { status: 'в сети' }
            return acc;
          }, {} as Record<string, {status: string}>) || {}
        };
        
        io.to(socketId).emit(msEvents.REQUEST_INFO_SUCCESS, result);

      } catch (e: any) {
        io.to(socketId).emit(msEvents.REQUEST_INFO_ERROR, e.message);
      }
    });



    // отзыв реквеста
    socket.on(msEvents.RECALL_FRIEND_REQUEST, async (requestUuid: string) => {

      try {
        const result = await friendRequestService.recallRequest(userUuid, requestUuid);
        io.to(socketId).emit(msEvents.RECALL_FRIEND_REQUEST_SUCCESS, result);

        const requestedSocketId = usersOnlineStore.getSocketId(result.requestedUuid);
        if (requestedSocketId)
          io.to(requestedSocketId).emit(msEvents.FRIEND_REQUEST_IS_RECALLED, result);

      } catch (e: any) {
        io.to(socketId).emit(msEvents.RECALL_FRIEND_REQUEST_ERROR, e.message);
      }
    });



    // принять реквест
    socket.on(msEvents.ACCEPT_FRIEND_REQUEST, async (requestUuid: string) => {
      try {
        const result = await friendRequestService.acceptRequest(userUuid, requestUuid);
        io.to(socketId).emit(msEvents.ACCEPT_FRIEND_REQUEST_SUCCESS, result);

        const requesterSocketId = usersOnlineStore.getSocketId(result.requesterUuid);
        if (requesterSocketId)
          io.to(requesterSocketId).emit(msEvents.FRIEND_REQUEST_IS_ACCEPTED, result);

      } catch (e: any) {
        io.to(socketId).emit(msEvents.ACCEPT_FRIEND_REQUEST_ERROR, e.message);
      }
    });



    // отклонить реквест
    socket.on(msEvents.DECLINE_FRIEND_REQUEST, async (requestUuid: string) => {
      try {
        const result = await friendRequestService.declineRequest(userUuid, requestUuid);
        io.to(socketId).emit(msEvents.DECLINE_FRIEND_REQUEST_SUCCESS, result);

        const requesterSocketId = usersOnlineStore.getSocketId(result.requesterUuid);
        if (requesterSocketId)
          io.to(requesterSocketId).emit(msEvents.FRIEND_REQUEST_IS_DECLINED, result);

      } catch (e: any) {
        io.to(socketId).emit(msEvents.DECLINE_FRIEND_REQUEST_ERROR, e.message);
      }
    });



    // отправляем свой реквест потенциальному другу
    socket.on(msEvents.SEND_FRIEND_REQUEST, async (requestedUserUuid: string) => {
      try {
        const result: any = await friendRequestService.createRequest(userUuid, requestedUserUuid);

        if (result?.type === 'counterRequest') {
          io.to(socketId).emit(msEvents.SEND_FRIEND_REQUEST_SUCCESS_ACCEPT);

          const requestedSocketId = usersOnlineStore.getSocketId(requestedUserUuid);
          if (requestedSocketId)
            io.to(requestedSocketId).emit(msEvents.FRIEND_REQUEST_IS_ACCEPTED, result?.data);

        }
        else {
          io.to(socketId).emit(msEvents.SEND_FRIEND_REQUEST_SUCCESS, result);

          const requestedSocketId = usersOnlineStore.getSocketId(requestedUserUuid);
          if (requestedSocketId)
            io.to(requestedSocketId).emit(msEvents.INCOMING_FRIEND_REQUEST, result);

        }
      } catch (e: any) {
        io.to(socketId).emit(msEvents.SEND_FRIEND_REQUEST_ERROR, e.message);
      }

    });

  };

  // события от сторонних систем
  friendshipEventEmitter.on(fsEventTypes.FRIEND_LIST_IS_CHANGED, ({ userUuid }) => {

    const adresseSocketId = usersOnlineStore.getSocketId(userUuid);
    if (adresseSocketId)
      io.to(adresseSocketId).emit(msEvents.UNFRIENDED);

  });

  usersOnlineStore.on(UsersStoreEvents.USER_ONLINE, (userData: Required<UserData>) => {
    const sockets = usersOnlineStore.getUserSocketIdsOfUserFriends(userData.uuid);
    io.to(sockets).emit(msEvents.FRIEND_IS_ONLINE, { 
      uuid: userData.uuid,
      status: 'в сети' 
    });
  });
  
  usersOnlineStore.on(UsersStoreEvents.USER_OFFLINE, (userData: Required<UserData>) => {
    const sockets = usersOnlineStore.getUserSocketIdsOfUserFriends(userData.uuid);
    io.to(sockets).emit(msEvents.FRIEND_IS_OFFLINE, { uuid: userData.uuid });
  });

  return friendshipSystemHandlers;
};


export default InitFriendshipSystemHandlers;