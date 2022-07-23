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

  };

  friendshipEventEmitter.on(fsEventTypes.FRIEND_REQUESTS_IS_CHANGED, ({requesterUuid, requestedUuid}) => {
    console.log('FRIEND_REQUESTS_IS_CHANGED');
    const user_1 = usersOnlineStore.getUser(requesterUuid);
    const user_2 = usersOnlineStore.getUser(requestedUuid);

    if (user_1) {
      io.to(user_1.socketId).emit(fsEvents.FRIEND_REQUESTS_UPDATED);
    }
    if (user_2) {
      io.to(user_2.socketId).emit(fsEvents.FRIEND_REQUESTS_UPDATED);
    }
  });

  friendshipEventEmitter.on(fsEventTypes.FRIEND_LIST_IS_CHANGED, ({userUuid_1, userUuid_2}) => {

    const user_1 = usersOnlineStore.getUser(userUuid_1);
    const user_2 = usersOnlineStore.getUser(userUuid_2);

    if(user_1) {
      io.to(user_1.socketId).emit(fsEvents.FRIEND_STATUSES);
    }
    if(user_2) {
      io.to(user_2.socketId).emit(fsEvents.FRIEND_STATUSES);
    }
    
  });

  return friendshipSystemHandlers;
};


export default InitFriendshipSystemHandlers;