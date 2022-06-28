import { useContext, useMemo } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";
import { ChatSystemEvents as chatEvents, MessagePostData } from "@ordinem-megachat-2022/shared";

const useWebsocketChatMessageEmitter = () => {
  const wc = useContext(WebsocketContext);
  if (!wc?.socket) {
    console.warn('there is no socket. chat system emitter is not initialized');
  }
  const socket = wc?.socket;

  const joinChannel = (channelUuid: string) => {
    socket?.emit(chatEvents.JOIN_CHANNEL, channelUuid);
  };

  const leaveChannel = (channelUuid: string) => {
    socket?.emit(chatEvents.LEAVE_CHANNEL, channelUuid);
  };

  const getLastMessages = (channelUuid: string) => {
    socket?.emit(chatEvents.REQUEST_CHAT_MESSAGES, channelUuid);
  };

  const getMessages = (channelUuid: string, cursor: string) => {
    socket?.emit(chatEvents.REQUEST_CHAT_MESSAGES, { channelUuid, cursor });
  };

  const sendMessage = (channelUuid: string, text: string) => {
    socket?.emit(chatEvents.SEND_MESSAGE, { channelUuid, text } as MessagePostData);
  };

  const methods = useMemo(() => ({
    getMessages,
    joinChannel,
    leaveChannel,
    getLastMessages,
    sendMessage
  }), [socket]);

  return methods;
}

export default useWebsocketChatMessageEmitter;