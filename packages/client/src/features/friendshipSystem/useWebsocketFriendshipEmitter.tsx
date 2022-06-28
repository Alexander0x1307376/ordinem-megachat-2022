import { FriendshipSystemEvents as fsEvents } from "@ordinem-megachat-2022/shared";
import { useContext } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";



// содержит методы для удобной отправки сообщений серверу
const useWebsocketFriendshipEmitter = () => {
  const wc = useContext(WebsocketContext);
  if (!wc?.socket) {
    console.warn('there is no socket. friendship system emitter is not initialized');
    return {
      sendFriendRequest: () => {},  
      recallFriendRequest: () => {},  
      acceptFriendRequest: () => {},  
      declineFriendRequest: () => {},  
    };
    // throw new Error('Socket is not initialized in WebsocketContext!!!');
  }
  const socket = wc.socket;
  
  
  return {
    sendFriendRequest: (friendUuid: string) => {
      socket.emit(fsEvents.SEND_FRIEND_REQUEST, friendUuid);
    },
    recallFriendRequest: (requestUuid: string) => {
      socket.emit(fsEvents.RECALL_FRIEND_REQUEST, requestUuid);
    },
    acceptFriendRequest: (requestUuid: string) => {
      socket.emit(fsEvents.ACCEPT_FRIEND_REQUEST, requestUuid);
    },
    declineFriendRequest: (requestUuid: string) => {
      socket.emit(fsEvents.DECLINE_FRIEND_REQUEST, requestUuid);
    }
  }
}

export default useWebsocketFriendshipEmitter;