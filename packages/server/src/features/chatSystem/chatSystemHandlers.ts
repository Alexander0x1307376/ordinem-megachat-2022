import { Server, Socket } from "socket.io"
import { IChannelService } from "../channels/channelService"
import { SocketUserData } from "../../sockets/socketTypes"
import UsersOnlineStore, { UserData, UsersStoreEvents as usEvents } from "../usersOnlineStore/UsersOnlineStore"
import { SubscribeToChangeData, ChatSystemEvents as csEvents, MessagePostData, ChangeData, Channel } from "@ordinem-megachat-2022/shared";
import { IMessageService } from "../messages/messageService";
import { 
  getChatRoomName,
  getGroupRoomName,
  getObserveUserRoomName,
  joinChatRoom, 
  joinGroupRoom, 
  leaveChatRoom, 
  leaveGroupRoom, 
  observeUser,
  unobserveUser
} from "./utils";
import { IGroupService } from "../group/groupService";
import { IUserService } from "../user/userService";
import { IChatRoomService } from "../chatRoom/chatRoomService";


const InitChatSystemHandlers = (
  io: Server, {
    usersOnlineStore,
    channelService,
    messageService,
    groupService,
    chatRoomService,
    userService
  }: {
    usersOnlineStore: UsersOnlineStore,
    channelService: IChannelService,
    messageService: IMessageService,
    userService: IUserService,
    chatRoomService: IChatRoomService,
    groupService: IGroupService
  }
) => {


  const chatSystemHandlers = (
    io: Server, socket: Socket, userData: SocketUserData
  ) => {
    const { id: socketId } = socket;
    const { userUuid } = userData;

    // #region подписка на изменения и отписка

    socket.on(csEvents.SUBSCRIBE_TO_CHANGES, async (data: Partial<SubscribeToChangeData>) => {
      try {
        
        // подписываемся на изменения сущностий
        data.groups?.forEach(item => joinGroupRoom(socket, item));
        data.rooms?.forEach(item => joinChatRoom(socket, item));
        data.users?.forEach(item => observeUser(socket, item));

        // собираем актуальные данные реального времени 
        const storeUsers = usersOnlineStore.getList();
        const usersOnline = data.users
          ?.filter((item: string) => storeUsers.has(item))
          .map(item => ({ uuid: item, status: 'в сети' })) || [];


        const result: ChangeData = {
          users: {
            data: usersOnline,
            changeType: 'replace'
          }
        };

        socket.emit(csEvents.CHANGES, result);
                

      } catch (e: any) {
        console.error(e.message);
      }
      
    });
    socket.on(csEvents.UNSUBSCRIBE_TO_CHANGES, async (data: Partial<SubscribeToChangeData>) => {

      data.groups?.forEach(item => {
        leaveGroupRoom(socket, item);
      });
      data.rooms?.forEach(item => {
        leaveChatRoom(socket, item);
      });
      data.users?.forEach(item => {
        unobserveUser(socket, item);
      });
    });

    // #endregion


    // #region каналы

    // пользователь подключился к каналу
    socket.on(csEvents.JOIN_ROOM, async (roomUuid: string) => {
      try {

        // проверить существование канала
        const isRoomExist = await chatRoomService.checkIfRoomExist(roomUuid);
        if (!isRoomExist) {
          io.to(socketId).emit(csEvents.JOIN_ROOM_ERROR, {
            message: `room with uuid ${roomUuid} doesn't exist`
          });
          return;
        }
        // присоединение к комнате канала
        // если юзер уже был присоединён к другой комнате - переключить его
        // если юзер уже в комнате - ничего не делать
        const userStoreData = usersOnlineStore.getUser(userUuid);
        if (!userStoreData) 
          throw new Error('Error while joining user to the channel');
        
        joinChatRoom(socket, roomUuid);
        
        const lastMessages = await messageService.getLastMessagesOfRoom(roomUuid);
        io.to(socketId).emit(csEvents.JOIN_ROOM_SUCCESS, lastMessages);
        console.log(`user ${userData.userName} joined channel ${roomUuid}`);
      } 
      catch (e: any) {
        console.error(e);
        io.to(socketId).emit(csEvents.JOIN_ROOM_ERROR, e.message);
      }
    });
    

    // пользователь отключился от канала
    socket.on(csEvents.LEAVE_ROOM, async (roomUuid: string) => {
      const isChannelExists = await chatRoomService.checkIfRoomExist(roomUuid);
      if (!isChannelExists) {
        io.to(socketId).emit(csEvents.LEAVE_ROOM_ERROR, { 
          message: `channel with uuid ${roomUuid} doesn't exist` 
        });
        return;
      }

      leaveChatRoom(socket, roomUuid);

      io.to(socketId).emit(csEvents.LEAVE_ROOM_SUCCESS);
      console.log(`user ${userData.userName} left channel ${roomUuid}`);
    });


    // #endregion


    // #region сообщения

    // запрос сообщений
    socket.on(csEvents.REQUEST_CHAT_MESSAGES, async ({ chatroomUuid, cursor }: { chatroomUuid: string, cursor: string}) => {
      try {
        const messageData = await messageService.getMessagesOfRoom(chatroomUuid, cursor, 20);
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

        const chatRoom = getChatRoomName(response.chatRoomUuid);

        // послать сообщение всем, кто сейчас в канале
        io.in(chatRoom).emit(csEvents.NEW_MESSAGE, result);
      } catch (e) {
        console.error(e);
        io.to(socketId).emit(csEvents.SEND_MESSAGE_ERROR, e);
      }
    });

    // #endregion
  }


  // #region Пользователи онлайн и оффлайн
  
  usersOnlineStore.on(usEvents.USER_ONLINE, async (userData: UserData) => {
    const observeUserRoom = getObserveUserRoomName(userData.uuid);
    io.in(observeUserRoom).emit(csEvents.USER_ONLINE, userData.uuid);
  });


  usersOnlineStore.on(usEvents.USER_OFFLINE, async (userData: UserData) => {
    const observeUserRoom = getObserveUserRoomName(userData.uuid);
    io.in(observeUserRoom).emit(csEvents.USER_OFFLINE, userData.uuid);
  });

  // #endregion


  // #region События каналов
  const reRequestChannels = (groupUuid: string) => {
    const groupRoomName = getGroupRoomName(groupUuid);
    io.in(groupRoomName).emit(csEvents.CHANGES_SIGNAL, 'group.channels');
  }
  channelService.onCreated(({ groupUuid }) => reRequestChannels(groupUuid));
  channelService.onUpdated(({ groupUuid }) => reRequestChannels(groupUuid));
  channelService.onRemoved(({ groupUuid, uuid: channelUuid }) => {
    reRequestChannels(groupUuid);
    io.socketsLeave(channelUuid);
  });
  // #endregion


  // #region События групп
  const reRequestGroupData = (groupUuid: string) => {
    const groupRoomName = getGroupRoomName(groupUuid);
    io.in(groupRoomName).emit(csEvents.CHANGES_SIGNAL, 'group.list');
  }
  groupService.onCreated(({ uuid }) => reRequestGroupData(uuid));
  groupService.onUpdated(({ uuid }) => reRequestGroupData(uuid));
  groupService.onRemoved(({ uuid }) => reRequestGroupData(uuid));
  // #endregion

  return chatSystemHandlers;
}

export default InitChatSystemHandlers;