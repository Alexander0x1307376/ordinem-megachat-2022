import { Server, Socket } from "socket.io"
import { IChannelService } from "../channels/channelService"
import { SocketUserData } from "../../sockets/socketTypes"
import UsersOnlineStore from "../usersOnlineStore/UsersOnlineStore"
import { ChatSystemEvents as csEvents, MessagePostData } from "@ordinem-megachat-2022/shared";
import { IMessageService } from "../messages/messageService";

const InitChatSystemHandlers = (
  io: Server, {
    usersOnlineStore,
    channelService,
    messageService
  }: {
    usersOnlineStore: UsersOnlineStore,
    channelService: IChannelService,
    messageService: IMessageService
  }
) => {


  const chatSystemHandlers = (
    io: Server, socket: Socket, userData: SocketUserData
  ) => {
    const { id: socketId } = socket;
    const { userUuid } = userData;


    // пользователь подключился к каналу
    socket.on(csEvents.JOIN_CHANNEL, async (channelUuid: string) => {
      try {

        // проверить существование канала
        const isChannelExists = await channelService.checkIfChannelExists(channelUuid);
        if (!isChannelExists) {
          io.to(socketId).emit(csEvents.JOIN_CHANNEL_ERROR, {
            message: `channel with uuid ${channelUuid} doesn't exist`
          });
          return;
        }

        console.log(`user ${userData.userName} joined channel ${channelUuid}`);
        
        // присоединение к комнате канала
        // если юзер уже был присоединён к другой комнате - переключить его
        // если юзер уже в комнате - ничего не делать

        const userStoreData = usersOnlineStore.getItem(userUuid);
        if (!userStoreData) throw new Error('Error while joining user to the channel');

        if (userStoreData.connectedChannel && userStoreData.connectedChannel !== channelUuid) {
          socket.leave(userStoreData.connectedChannel);
        }

        usersOnlineStore.attachUserToChannel(userUuid, channelUuid);
        socket.join(channelUuid);


        
        const lastMessages = await messageService.getLastMessagesOfChannel(channelUuid);
        io.to(socketId).emit(csEvents.JOIN_CHANNEL_SUCCESS, lastMessages);
      } 
      catch (e: any) {
        console.log('Блять!');
        console.error(e);
        io.to(socketId).emit(csEvents.JOIN_CHANNEL_ERROR, e.message);
      }
    });
    

    // пользователь отключился от канала
    socket.on(csEvents.LEAVE_CHANNEL, async (channelUuid: string) => {
      const isChannelExists = await channelService.checkIfChannelExists(channelUuid);
      if (!isChannelExists) {
        io.to(socketId).emit(csEvents.LEAVE_CHANNEL_ERROR, { 
          message: `channel with uuid ${channelUuid} doesn't exist` 
        });
        return;
      }

      console.log(`user ${userData.userName} left channel ${channelUuid}`);
      usersOnlineStore.detachUserFromChannel(userUuid, channelUuid);
      io.to(socketId).emit(csEvents.LEAVE_CHANNEL_SUCCESS);
    });


    // запрос сообщений
    socket.on(csEvents.REQUEST_CHAT_MESSAGES, async ({ channelUuid, cursor }: {channelUuid: string, cursor: string}) => {
      try {
        const messageData = await messageService.getMessagesOfChannel(channelUuid, cursor, 20);
        io.to(socketId).emit(csEvents.REQUEST_CHAT_MESSAGES_SUCCESS, messageData);
      }
      catch (e) {
        console.error(e);
        io.to(socketId).emit(csEvents.REQUEST_CHAT_MESSAGES_ERROR);
      }
    });

    
    // новое сообщение в канале
    socket.on(csEvents.SEND_MESSAGE, async (response: MessagePostData) => {
      try {
        const result = await messageService.createMessage(userUuid, response);

        const channel = usersOnlineStore.getItem(userUuid)?.connectedChannel;
        if (!channel) throw new Error('Error while getting user and channel data');

        // послать сообщение всем, кто сейчас в канале
        io.to(channel).emit(csEvents.NEW_MESSAGE, result);
      } catch (e) {
        console.error(e);
        io.to(socketId).emit(csEvents.SEND_MESSAGE_ERROR, e);
      }
    });
  }

  return chatSystemHandlers;
}

export default InitChatSystemHandlers;