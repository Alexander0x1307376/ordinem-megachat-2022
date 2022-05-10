import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { SERVER_URI } from "../../config";
import { store } from "../../store/store";
import { getUserFromLocalStorage } from "../../utils/authUtils";
import { messageSystemActions as msActions} from "./messageSystemSlice";
import { RequestsInfo } from '@apiTypes/friendRequestTypes';

const messageSystemMiddleware: Middleware = store => {
  let socket: Socket;

  return next => action => {

    const isConnectionEstablished = socket && store.getState().messageSystem.isConnected;

    // если экшон === startConnecting - настраиваем socket
    if (msActions.startConnecting.match(action)) {

      const user = getUserFromLocalStorage();
      if(!user) {
        next(action);
        return;
      }

      const handshake = {
        ...user.userData,
        accessToken: user.accessToken
      };

      socket = io(SERVER_URI, {
        // withCredentials: true,
        query: handshake
      });

      // ставим состояние "соединение установлено" и запрашиваем по сокету данные с сервера
      socket.on('connect', () => {
        store.dispatch(msActions.connectionEstablished());
        socket.emit('friendRequests:getInfo');
        console.log('connection established!');
      });

      // подписываемся на сокет-сообщения
      // запрос информации о запросах дружбы
      socket.on('friendRequests:sentInfo', (requestData: RequestsInfo) => {
        console.log('friendRequests:sentInfo!');
        store.dispatch(msActions.setFriendRequests(requestData));
      });

      // socket.io('friendRequests:incomingRequest', (friendRequest) => {

      // });
    }

    if (isConnectionEstablished && socket) {

      // отправить запос другому
      if(msActions.sendFriendRequest === action) {
        socket.emit('friendRequests:send');
      }

      // отозвать свой запрос

      // получить входящий запрос

      // принять входящий запрос

      // отклонить входящий запрос

    }

    next(action);
  }
}

export default messageSystemMiddleware;