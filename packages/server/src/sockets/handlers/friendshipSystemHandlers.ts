import { Server, Socket } from "socket.io";
import { IFriendRequestService } from "../../features/friendshipSystem/friendRequestService";
import { RequestsInfo, MessageSystemEvents as msEvents } from "@ordinem-megachat-2022/shared";
import FriendshipSystemEventEmitter, {EventTypes as fsEventTypes} from "../../features/friendshipSystem/friendshipSystemEventEmitter";
import UsersOnlineStore, { UserData, UsersStoreEvents } from "./UsersOnlineStore";
import { SocketUserData } from "../socketTypes";



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
    socket.on(msEvents.REQUEST_INFO, async () => {
      try {
        const result: RequestsInfo = {
          friendRequests: await friendRequestService.getRequests(userUuid),
          friendsStatuses: usersOnlineStore.getFriendsData(userUuid) 
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


  friendshipEventEmitter.on(fsEventTypes.BECAME_FRIENDS, ({userUuid_1, userUuid_2}) => {

    const user_1 = usersOnlineStore.getItem(userUuid_1);
    const user_2 = usersOnlineStore.getItem(userUuid_2);

    usersOnlineStore.addFriendship(userUuid_1, userUuid_2);

    if(user_1) {
      const friendStatuses_1 = usersOnlineStore.getFriendsData(userUuid_1);
      io.to(user_1.socketId).emit(msEvents.FRIEND_STATUSES, friendStatuses_1);
    }
    if(user_2) {
      const friendStatuses_2 = usersOnlineStore.getFriendsData(userUuid_2);
      io.to(user_2.socketId).emit(msEvents.FRIEND_STATUSES, friendStatuses_2);
    }
    
  });

  friendshipEventEmitter.on(fsEventTypes.UNFRIENDED, ({ userUuid_1, userUuid_2}) => {
    // получаем пользователей
    const user_1 = usersOnlineStore.getItem(userUuid_1);
    const user_2 = usersOnlineStore.getItem(userUuid_2);
    
    // правим онлайн хранилище
    usersOnlineStore.removeFriendship(userUuid_1, userUuid_2);

    if(user_1)
      io.to(user_1.socketId).emit(msEvents.UNFRIENDED);
    if(user_2)
      io.to(user_2.socketId).emit(msEvents.UNFRIENDED);
  });



  usersOnlineStore.on(UsersStoreEvents.USER_ONLINE, (userData: Required<UserData>) => {
    const sockets = usersOnlineStore.getUserSocketIdsOfUserFriends(userData.uuid);
    if (sockets.length) {
      io.to(sockets).emit(msEvents.FRIEND_IS_ONLINE, { 
        uuid: userData.uuid,
        status: 'в сети' 
      });
    }
  });
  
  usersOnlineStore.on(UsersStoreEvents.USER_OFFLINE, (userData: Required<UserData>) => {
    const sockets = usersOnlineStore.getUserSocketIdsOfUserFriends(userData.uuid);
    io.to(sockets).emit(msEvents.FRIEND_IS_OFFLINE, { uuid: userData.uuid });
  });

  return friendshipSystemHandlers;
};


export default InitFriendshipSystemHandlers;