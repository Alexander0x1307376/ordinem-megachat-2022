import { Server, Socket } from "socket.io"
import { IChannelService } from "../channels/channelService"
import { SocketUserData } from "../../sockets/socketTypes"
import UsersOnlineStore, { OnlineStoreEventData, UserData, UsersStoreEvents as usEvents } from "../usersOnlineStore/UsersOnlineStore"
import { ChangeData, ChatSystemEvents as csEvents, MessagePostData } from "@ordinem-megachat-2022/shared";
import { IMessageService } from "../messages/messageService";
import { 
  getChannelRoomName,
  getGroupRoomName,
  getObserveUserRoomName,
  joinChannelRoom, 
  joinGroupRoom, 
  leaveChannelRoom, 
  leaveGroupRoom, 
  observeUser,
  unobserveUser
} from "./utils";
import { IGroupService } from "../group/groupService";
import { IUserService } from "../user/userService";
import { ServiceEvents } from "../crudService/changeDataEventEmitter";

const InitChatSystemHandlers = (
  io: Server, {
    usersOnlineStore,
    channelService,
    messageService,
    groupService,
    userService
  }: {
    usersOnlineStore: UsersOnlineStore,
    channelService: IChannelService,
    messageService: IMessageService,
    userService: IUserService,
    groupService: IGroupService
  }
) => {


  const chatSystemHandlers = (
    io: Server, socket: Socket, userData: SocketUserData
  ) => {
    const { id: socketId } = socket;
    const { userUuid } = userData;


    socket.on('connection', async () => {
      console.log('chatSystemHandlers connect');
    });


    socket.on(csEvents.SUBSCRIBE_TO_CHANGES, async (data: Partial<ChangeData>) => {
      try {

        usersOnlineStore.setObservableData(userUuid, data);
        console.log('SUBSCRIBE_TO_CHANGES', data);
        
        // подписываемся на изменения сущностий
        data.groups?.forEach(item => {
          joinGroupRoom(socket, item);
        });
        data.channels?.forEach(item => {
          joinChannelRoom(socket, item);
        });
        data.users?.forEach(item => {
          observeUser(socket, item);
        });

        // собираем актуальные данные реального времени 
        const storeUsers = usersOnlineStore.getList();
        const usersOnline = data.users?.filter(item => storeUsers.has(item));


        const result = {
          data: { users: usersOnline },
          type: { users: 'replace' }
        } as OnlineStoreEventData;

        socket.emit(csEvents.CHANGES, result);
                

      } catch (e: any) {
        console.error(e.message);
      }
      
    });
    socket.on(csEvents.UNSUBSCRIBE_TO_CHANGES, async (data: Partial<ChangeData>) => {
      usersOnlineStore.unsetObservableData(userUuid, data);
      console.log('UNSUBSCRIBE_TO_CHANGES', data);

      data.groups?.forEach(item => {
        leaveGroupRoom(socket, item);
      });
      data.channels?.forEach(item => {
        leaveChannelRoom(socket, item);
      });
      data.users?.forEach(item => {
        unobserveUser(socket, item);
      });
    });

    // #region Пользователи

    // пользователи онлайн
    // socket.on(csEvents.WATCH_USER_STATUSES, async (userUuidList: string[]) => {
    //   console.log('csEvents.WATCH_USER_STATUSES')

    //   // usersOnlineStore.setUsersToWatch(userUuid, userUuidList);
    //   usersOnlineStore.addObservableUsers(userUuid, userUuidList);
    //   const statuses = userUuidList.reduce((acc, item) => {
    //     const user = usersOnlineStore.getItem(item);
    //     if(user)
    //       return { ...acc, [user.uuid]: { status: 'в сети' } }
    //     else
    //       return acc;
    //   }, {} as Record<string, any>);

    //   io.to(socketId).emit(csEvents.WATCH_USER_STATUSES_SUCCESS, statuses);
    // });

    // socket.on(csEvents.UNWATCH_USER_STATUSES, async (userUuidList: string[]) => {
    //   usersOnlineStore.removeObservableUsers(userUuid, userUuidList);
    //   io.to(socketId).emit(csEvents.UNWATCH_USER_STATUSES_SUCCESS);
    // });

    // #endregion


    // #region каналы

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
        // присоединение к комнате канала
        // если юзер уже был присоединён к другой комнате - переключить его
        // если юзер уже в комнате - ничего не делать
        const userStoreData = usersOnlineStore.getItem(userUuid);
        if (!userStoreData) throw new Error('Error while joining user to the channel');
        
        joinChannelRoom(socket, channelUuid);
        usersOnlineStore.setChannels(userUuid, [channelUuid]);
        
        const lastMessages = await messageService.getLastMessagesOfChannel(channelUuid);
        io.to(socketId).emit(csEvents.JOIN_CHANNEL_SUCCESS, lastMessages);
        console.log(`user ${userData.userName} joined channel ${channelUuid}`);
      } 
      catch (e: any) {
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

      usersOnlineStore.removeChannels(userUuid, [channelUuid]);
      leaveChannelRoom(socket, channelUuid);

      io.to(socketId).emit(csEvents.LEAVE_CHANNEL_SUCCESS);
      console.log(`user ${userData.userName} left channel ${channelUuid}`);
    });


    // #endregion


    // #region сообщения

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

        const channel = usersOnlineStore.getItem(userUuid)?.observables.channels[0];
        if (!channel) 
          throw new Error('Error while getting user and channel data');

        // послать сообщение всем, кто сейчас в канале
        io.to(channel).emit(csEvents.NEW_MESSAGE, result);
      } catch (e) {
        console.error(e);
        io.to(socketId).emit(csEvents.SEND_MESSAGE_ERROR, e);
      }
    });

    // #endregion
  }

  
  usersOnlineStore.on(usEvents.USER_ONLINE, async (userData: UserData) => {
    // каждому, кто отслеживает этого пользователя, сообщить, что он онлайн
    const users = usersOnlineStore.getList();
    // найти тех, кто отслеживает этого пользователя
    users.forEach((user) => {
      if (!user.observables.users.includes(userData.uuid)) return;
      io.to(user.socketId).emit(csEvents.USER_ONLINE, userData.uuid);
    });
  });


  usersOnlineStore.on(usEvents.USER_OFFLINE, async (userData: UserData) => {
    const users = usersOnlineStore.getList();
    users.forEach((user) => {
      if (!user.observables.users.includes(userData.uuid)) return;
      io.to(user.socketId).emit(csEvents.USER_OFFLINE, userData.uuid);
    });
  });

  // изменившиеся данные распихиваем подписчикам согласно их подпискам
  // TODO: ёбаный пиздец - надо изменить
  usersOnlineStore.on(usEvents.CHANGE_DATA, async ({ data, type }: OnlineStoreEventData) => {
    
    const channelRooms = data.channels?.map(item => getChannelRoomName(item));
    const groupRooms = data.channels?.map(item => getGroupRoomName(item));
    const observeUserRooms = data.channels?.map(item => getObserveUserRoomName(item));
    
    if (channelRooms && channelRooms.length) {
      io.in(channelRooms).emit(csEvents.CHANGES, {
        data: { channels: data.channels },
        type: { channels: type.channels }
      } as OnlineStoreEventData);
    }
    if (groupRooms && groupRooms.length) {
      io.in(groupRooms).emit(csEvents.CHANGES, {
        data: { groups: data.groups },
        type: { groups: type.groups }
      } as OnlineStoreEventData);
    }
    if (observeUserRooms && observeUserRooms.length) {
      io.in(observeUserRooms).emit(csEvents.CHANGES, {
        data: { users: data.users },
        type: { users: type.users }
      } as OnlineStoreEventData);
    }

  });

  groupService.on(ServiceEvents.ENTITY_CREATED, (data) => {

  });
  groupService.on(ServiceEvents.ENTITY_UPDATED, (data) => {

  });
  groupService.on(ServiceEvents.ENTITY_REMOVED, (data) => {
    
  });

  return chatSystemHandlers;
}

export default InitChatSystemHandlers;