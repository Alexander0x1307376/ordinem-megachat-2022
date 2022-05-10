import { Server, Socket } from "socket.io";
import { messageHandlers } from "./handlers/messageHandlers";

const socketServer = (io: Server, socket: Socket | any) => {
  // извлекаем идентификатор комнаты и имя пользователя
  const { uuid, name, avaUrl, accessToken } = socket.handshake.query;

  console.log('socketServer');
  // console.log('socketServer', { uuid, name, avaUrl, accessToken });

  

  const roomId = `user_${uuid}`;

  // записываем их в объект сокета
  socket.roomId = roomId;
  socket.userName = name;
  socket.userUuid = uuid;

  // присоединяемся к комнате
  socket.join(roomId);

  messageHandlers(io, socket);
}

export default socketServer;