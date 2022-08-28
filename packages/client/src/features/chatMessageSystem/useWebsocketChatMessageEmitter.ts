import { useContext, useMemo } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";
import { ChatSystemEvents as chatEvents, MessagePostData } from "@ordinem-megachat-2022/shared";

const useWebsocketChatMessageEmitter = () => {
  const wc = useContext(WebsocketContext);
  if (!wc?.socket) {
    console.warn('there is no socket. chat system emitter is not initialized');
  }
  const socket = wc?.socket;


  const result = useMemo(() => {

    const joinRoom = (roomUuid: string) => {
      // console.log('ChatMessageEmitter.joinRoom');
      socket?.emit(chatEvents.JOIN_ROOM, roomUuid);
    };

    const leaveRoom = (roomUuid: string) => {
      // console.log('ChatMessageEmitter.leaveRoom');
      socket?.emit(chatEvents.LEAVE_ROOM, roomUuid);
    };

    const leaveAllRooms = () => {
      // console.log('ChatMessageEmitter.leaveRoom');
      socket?.emit(chatEvents.LEAVE_ALL_ROOMS);
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

    return {
      getMessages,
      joinRoom,
      leaveRoom,
      leaveAllRooms,
      getLastMessages,
      sendMessage,
      isSocketLoaded: !!socket
    }
  }, [socket]);
  return result;

}

export default useWebsocketChatMessageEmitter;