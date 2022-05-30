import { Server, Socket } from "socket.io"
import { IChannelService } from "../../features/channels/channelService"
import { SocketUserData } from "../socketTypes"
import UsersOnlineStore from "./UsersOnlineStore"
import { ChatSystemEvents as csEvents } from "@ordinem-megachat-2022/shared";

const InitChatSystemHandlers = (
  io: Server, {
    usersOnlineStore,
    channelService
  }: {
    usersOnlineStore: UsersOnlineStore,
    channelService: IChannelService
  }
) => {


  const chatSystemHandlers = (
    io: Server, socket: Socket, userData: SocketUserData
  ) => {
    const { id: socketId } = socket;
    const { userUuid } = userData;

    socket.on(csEvents.JOIN_CHANNEL, (channelUuid: string) => {
      usersOnlineStore.attachUserToChannel(userUuid, channelUuid);
      socket.emit(csEvents.JOIN_CHANNEL_SUCCESS);
    });

    socket.on(csEvents.REQUEST_CHAT_MESSAGES, () => {

    });

    socket.on(csEvents.UPDATE_MESSAGES, () => {

    });
  }

  return chatSystemHandlers;
}

export default InitChatSystemHandlers;