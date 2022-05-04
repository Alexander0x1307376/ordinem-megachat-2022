import { Server, Socket } from "socket.io";

const socketServer = (io: Server, socket: Socket | any) => {
  // извлекаем идентификатор комнаты и имя пользователя
  const { roomId, userName } = socket.handshake.query;

  // записываем их в объект сокета
  socket.roomId = roomId;
  socket.userName = userName;

  // присоединяемся к комнате
  socket.join(roomId);
}

export default socketServer;