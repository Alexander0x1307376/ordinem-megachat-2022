import { useContext, useMemo } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";
import { ChatSystemEvents as chatEvents, MessagePostData } from "@ordinem-megachat-2022/shared";

const useWebsocketChatMessageEmitter = () => {
  const wc = useContext(WebsocketContext);
  if (!wc?.socket) {
    console.warn('there is no socket. chat system emitter is not initialized');
  }
  const socket = wc?.socket;

  const joinRoom = (roomUuid: string) => {
    socket?.emit(chatEvents.JOIN_ROOM, roomUuid);
  };

  const leaveRoom = (roomUuid: string) => {
    socket?.emit(chatEvents.LEAVE_ROOM, roomUuid);
  };

  const getLastMessages = (roomUuid: string) => {
    socket?.emit(chatEvents.REQUEST_CHAT_MESSAGES, roomUuid);
  };

  const getMessages = (roomUuid: string, cursor: string) => {
    socket?.emit(chatEvents.REQUEST_CHAT_MESSAGES, { roomUuid, cursor });
  };

  const sendMessage = (chatRoomUuid: string, text: string) => {
    socket?.emit(chatEvents.SEND_MESSAGE, { chatRoomUuid, text } as MessagePostData);
  };

  const methods = useMemo(() => ({
    getMessages,
    joinRoom,
    leaveRoom,
    getLastMessages,
    sendMessage
  }), [socket]);

  return methods;
}

export default useWebsocketChatMessageEmitter;