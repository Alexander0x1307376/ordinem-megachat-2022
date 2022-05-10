import { Server, Socket } from "socket.io";
import friendRequestService from "../../features/friendRequest/friendRequestService";
import {MessageSystemEvents as msEvents} from '../../webSocketMessages/messageSystemEvents';

export const messageHandlers = (io: Server, socket: Socket | any) => {
  // извлекаем идентификатор комнаты
  const { roomId, userUuid } = socket;

  socket.on(msEvents.REQUEST_INFO, async () => {

    console.log('get info?!!!!');
    const info = await friendRequestService.getRequests(userUuid);
    io.to(roomId).emit(msEvents.REQUEST_INFO_IS_SENT, info);
  });

  socket.on('message:add', (message: any) => {

  });

  
  socket.on('message:remove', (message: any) => {

  });



};