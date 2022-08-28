// import { FriendshipSystemEvents as fsEvents } from "@ordinem-megachat-2022/shared";
import { useMemo } from "react";
import { useContext } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";



// содержит методы для удобной отправки сообщений серверу
const useWebsocketFriendshipEmitter = () => {
  const wc = useContext(WebsocketContext);
  if (!wc?.socket) {
    console.warn('there is no socket. realtime system emitter is not initialized');
  }

  const socket = wc?.socket;

  const result = useMemo(() => {
    const sendFriendRequest = (friendUuid: string) => {
      // socket?.emit(fsEvents.SEND_FRIEND_REQUEST, friendUuid);
    };
    const recallFriendRequest = (requestUuid: string) => {
      // socket?.emit(fsEvents.RECALL_FRIEND_REQUEST, requestUuid);
    };
    const acceptFriendRequest = (requestUuid: string) => {
      // socket?.emit(fsEvents.ACCEPT_FRIEND_REQUEST, requestUuid);
    };
    const declineFriendRequest = (requestUuid: string) => {
      // socket?.emit(fsEvents.DECLINE_FRIEND_REQUEST, requestUuid);
    };
    return {
      sendFriendRequest,
      recallFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      isSocketLoaded: !!socket
    }
  }, [socket]);
  return result;
}

export default useWebsocketFriendshipEmitter;