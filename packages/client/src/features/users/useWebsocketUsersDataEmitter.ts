import { useContext, useMemo } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";
import { ChatSystemEvents as chatEvents } from "@ordinem-megachat-2022/shared";

const useWebsocketUsersDataEmitter = () => {
  const wc = useContext(WebsocketContext);
  if (!wc?.socket) {
    console.warn('there is no socket. users data emitter is not initialized');
  }
  const socket = wc?.socket;

  const getUserStatuses = (userUuidList: string[]) => {
    socket?.emit(chatEvents.REQUEST_USER_STATUSES, userUuidList);
  };
  
  const observeUserStatuses = (userUuidList: string[]) => {
    // socket?.emit(chatEvents.WATCH_USER_STATUSES, userUuidList);
  }

  const unobserveUserStatuses = (userUuidList: string[]) => {
    // socket?.emit(chatEvents.UNWATCH_USER_STATUSES, userUuidList);
  }


  const methods = useMemo(() => ({
    getUserStatuses,
    observeUserStatuses,
    unobserveUserStatuses
  }), [socket]);

  return methods;
}

export default useWebsocketUsersDataEmitter;