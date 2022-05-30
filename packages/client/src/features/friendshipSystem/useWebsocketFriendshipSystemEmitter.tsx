import { MessageSystemEvents as msEvents } from "@ordinem-megachat-2022/shared";
import { useContext } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";



// содержит методы для удобной отправки сообщений серверу
const useWebsocketFriendshipSystemEmitter = () => {
  const wc = useContext(WebsocketContext);
  if (!wc?.socket)
    throw new Error('Socket is not initialized in WebsocketContext!!!');
  const socket = wc.socket;
  
  
  return {
    sendFriendRequest: (friendUuid: string) => {
      socket.emit(msEvents.SEND_FRIEND_REQUEST, friendUuid);
    },
    recallFriendRequest: (requestUuid: string) => {
      socket.emit(msEvents.RECALL_FRIEND_REQUEST, requestUuid);
    },
    acceptFriendRequest: (requestUuid: string) => {
      socket.emit(msEvents.ACCEPT_FRIEND_REQUEST, requestUuid);
    },
    declineFriendRequest: (requestUuid: string) => {
      socket.emit(msEvents.DECLINE_FRIEND_REQUEST, requestUuid);
    }
  }
}

export default useWebsocketFriendshipSystemEmitter;