import { Server, Socket } from "socket.io";
import { IFriendRequestService } from "./friendRequestService";
import { RequestsInfo, FriendshipSystemEvents as fsEvents } from "@ordinem-megachat-2022/shared";
import FriendshipSystemEventEmitter, {EventTypes as fsEventTypes} from "./friendshipSystemEventEmitter";
import UsersOnlineStore, { UserData, UsersStoreEvents } from "../usersOnlineStore/UsersOnlineStore";
import { SocketUserData } from "../../sockets/socketTypes";



const InitFriendshipSystemHandlers = (
  io: Server, { 
    usersOnlineStore, friendshipEventEmitter, friendRequestService 
  } : { 
    usersOnlineStore: UsersOnlineStore, 
    friendshipEventEmitter: FriendshipSystemEventEmitter,
    friendRequestService: IFriendRequestService
  }
) => {

  const friendshipSystemHandlers = (
    io: Server, socket: Socket, userData: SocketUserData
  ) => {

    const { id: socketId } = socket;
    const { userUuid } = userData;

    // запрос информации о реквестах и статусе друзей при подключении
    socket.on(fsEvents.REQUEST_INFO, async () => {
      
    });



    // отзыв реквеста
    socket.on(fsEvents.RECALL_FRIEND_REQUEST, async (requestUuid: string) => {

      try {
        const result = await friendRequestService.recallRequest(userUuid, requestUuid);
        io.to(socketId).emit(fsEvents.RECALL_FRIEND_REQUEST_SUCCESS, result);

        const requestedSocketId = usersOnlineStore.getSocketId(result.requestedUuid);
        if (requestedSocketId)
          io.to(requestedSocketId).emit(fsEvents.FRIEND_REQUEST_IS_RECALLED, result);

      } catch (e: any) {
        io.to(socketId).emit(fsEvents.RECALL_FRIEND_REQUEST_ERROR, e.message);
      }
    });



    // принять реквест
    socket.on(fsEvents.ACCEPT_FRIEND_REQUEST, async (requestUuid: string) => {
      try {
        const result = await friendRequestService.acceptRequest(userUuid, requestUuid);
        io.to(socketId).emit(fsEvents.ACCEPT_FRIEND_REQUEST_SUCCESS, result);

        const requesterSocketId = usersOnlineStore.getSocketId(result.requesterUuid);
        if (requesterSocketId) 
          io.to(requesterSocketId).emit(fsEvents.FRIEND_REQUEST_IS_ACCEPTED, result);

      } catch (e: any) {
        io.to(socketId).emit(fsEvents.ACCEPT_FRIEND_REQUEST_ERROR, e.message);
      }
    });



    // отклонить реквест
    socket.on(fsEvents.DECLINE_FRIEND_REQUEST, async (requestUuid: string) => {
      try {
        const result = await friendRequestService.declineRequest(userUuid, requestUuid);
        io.to(socketId).emit(fsEvents.DECLINE_FRIEND_REQUEST_SUCCESS, result);

        const requesterSocketId = usersOnlineStore.getSocketId(result.requesterUuid);
        if (requesterSocketId)
          io.to(requesterSocketId).emit(fsEvents.FRIEND_REQUEST_IS_DECLINED, result);

      } catch (e: any) {
        io.to(socketId).emit(fsEvents.DECLINE_FRIEND_REQUEST_ERROR, e.message);
      }
    });



    // отправляем свой реквест потенциальному другу
    socket.on(fsEvents.SEND_FRIEND_REQUEST, async (requestedUserUuid: string) => {
      try {
        const result: any = await friendRequestService.createRequest(userUuid, requestedUserUuid);

        if (result?.type === 'counterRequest') {
          io.to(socketId).emit(fsEvents.SEND_FRIEND_REQUEST_SUCCESS_ACCEPT);

          const requestedSocketId = usersOnlineStore.getSocketId(requestedUserUuid);
          if (requestedSocketId)
            io.to(requestedSocketId).emit(fsEvents.FRIEND_REQUEST_IS_ACCEPTED, result?.data);

        }
        else {
          io.to(socketId).emit(fsEvents.SEND_FRIEND_REQUEST_SUCCESS, result);

          const requestedSocketId = usersOnlineStore.getSocketId(requestedUserUuid);
          if (requestedSocketId)
            io.to(requestedSocketId).emit(fsEvents.INCOMING_FRIEND_REQUEST, result);

        }
      } catch (e: any) {
        io.to(socketId).emit(fsEvents.SEND_FRIEND_REQUEST_ERROR, e.message);
      }

    });

  };


  friendshipEventEmitter.on(fsEventTypes.BECAME_FRIENDS, ({userUuid_1, userUuid_2}) => {

    const user_1 = usersOnlineStore.getUser(userUuid_1);
    const user_2 = usersOnlineStore.getUser(userUuid_2);

    // usersOnlineStore.addFriendship(userUuid_1, userUuid_2);

    // if(user_1) {
    //   const friendStatuses_1 = usersOnlineStore.getFriendsData(userUuid_1);
    //   io.to(user_1.socketId).emit(fsEvents.FRIEND_STATUSES, friendStatuses_1);
    // }
    // if(user_2) {
    //   const friendStatuses_2 = usersOnlineStore.getFriendsData(userUuid_2);
    //   io.to(user_2.socketId).emit(fsEvents.FRIEND_STATUSES, friendStatuses_2);
    // }
    
  });

  friendshipEventEmitter.on(fsEventTypes.UNFRIENDED, ({ userUuid_1, userUuid_2}) => {
    // получаем пользователей
    const user_1 = usersOnlineStore.getUser(userUuid_1);
    const user_2 = usersOnlineStore.getUser(userUuid_2);
    
    // правим онлайн хранилище
    // usersOnlineStore.removeFriendship(userUuid_1, userUuid_2);

    if(user_1)
      io.to(user_1.socketId).emit(fsEvents.UNFRIENDED);
    if(user_2)
      io.to(user_2.socketId).emit(fsEvents.UNFRIENDED);
  });

  return friendshipSystemHandlers;
};


export default InitFriendshipSystemHandlers;