import { Server, Socket } from "socket.io";

const messages: any = {};

const messageHandlers = (io: Server, socket: Socket | any) => {
  // извлекаем идентификатор комнаты
  const { roomId } = socket;

  // утилита для обновления списка сообщений
  const updateMessageList = () => {
    io.to(roomId).emit('message_list:update', messages[roomId]);
  };

  // обрабатываем получение сообщений
  socket.on('message:get', async () => {
    try {
      // получаем сообщения по `id` комнаты
      // const _messages = await Message.find({
      //   roomId
      // })
      // инициализируем хранилище сообщений
      // messages[roomId] = _messages

      // обновляем список сообщений
      updateMessageList()
    } catch (e) {
      // onError(e)
    }
  });

  socket.on('message:add', (message: any) => {

  });

  
  socket.on('message:remove', (message: any) => {

  });



};