import { Socket } from "socket.io-client";
import { FriendshipSystemEvents as fsEvents } from '@ordinem-megachat-2022/shared';
import { AnyAction, Store } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import friendRequestApi from './friendRequestsService';
import userApi from "../users/usersService";


/**
 * принимает сообщения от вебсокет-сервера и правит стейт соответствующим образом
 */
const websocketFriendshipReceiver = (
  socket: Socket, store: Store<RootState, AnyAction>
) => {
  
  socket.on(fsEvents.FRIEND_REQUESTS_UPDATED, () => {
    console.log('FRIEND_REQUESTS_UPDATED');
    store.dispatch(friendRequestApi.util.invalidateTags(['friendRequests']));
    store.dispatch(userApi.util.invalidateTags(['friends']));
  });
  
  socket.on(fsEvents.FRIEND_STATUSES, () => {
    console.log('FRIEND_STATUSES');
    store.dispatch(friendRequestApi.util.invalidateTags(['friendRequests']));
    store.dispatch(userApi.util.invalidateTags(['friends']));
  });
}

export default websocketFriendshipReceiver;