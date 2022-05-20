import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { SERVER_URI } from "../../config";
import { store } from "../../store/store";
import { getUserFromLocalStorage } from "../../utils/authUtils";
import { friendshipSystemActions as msActions} from "./friendshipSystemSlice";
import { RequestsInfo, MessageSystemEvents as msEvents, FriendRequest, FriendRequestUuids } from '@ordinem-megachat-2022/shared';
import useApi, { userApi } from "../../store/services/usersService";


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
        socket.emit(msEvents.REQUEST_INFO);
        console.log('connection established!');
      });

      // подписываемся на сокет-сообщения

      // запрос всей информации о запросах дружбы
      socket.on(msEvents.REQUEST_INFO_SUCCESS, (requestData: RequestsInfo) => {
        console.log('REQUEST_INFO_SUCCESS', requestData);
        store.dispatch(msActions.setFriendInfo(requestData));
      });

      // запрос дружить успешно отправлен
      socket.on(msEvents.SEND_FRIEND_REQUEST_SUCCESS, (requestData: FriendRequest) => {
        store.dispatch(msActions.sendFriendRequestSucsess(requestData));
      });

      // когда запрос дружбы отправлен при наличии встречного запроса
      socket.on(msEvents.SEND_FRIEND_REQUEST_SUCCESS_ACCEPT, (requestData: FriendRequest) => {
        store.dispatch(userApi.util.invalidateTags(['friends']));
        socket.emit(msEvents.REQUEST_INFO);
      });

      // сервер сообщает нам об успешном принятии нами запроса дружбы
      socket.on(msEvents.ACCEPT_FRIEND_REQUEST_SUCCESS, (request: FriendRequestUuids) => {
        store.dispatch(msActions.acceptFriendRequestSucsess(request.uuid));
        // перезапрашиваем список друзей
        store.dispatch(userApi.util.invalidateTags(['friends']));
      });

      // отмена нами запроса дружбы обработана
      socket.on(msEvents.DECLINE_FRIEND_REQUEST_SUCCESS, (request: FriendRequestUuids) => {
        store.dispatch(msActions.declineFriendRequestSucsess(request.uuid));
      });

      // мы успешно отозвали наш собственный запрос дружить
      socket.on(msEvents.RECALL_FRIEND_REQUEST_SUCCESS, (request: FriendRequestUuids) => {
        store.dispatch(msActions.recallFriendRequestSucsess(request.uuid));
      });

      // входящие запросы

      // к нам пришёл запрос дружбы
      socket.on(msEvents.INCOMING_FRIEND_REQUEST, (friendRequest: FriendRequest) => {
        store.dispatch(msActions.incomingFriendRequest(friendRequest));
      });

      // чувак принял наш запрос дружить
      socket.on(msEvents.FRIEND_REQUEST_IS_ACCEPTED, (request: FriendRequestUuids) => {
        store.dispatch(msActions.outcomingRequestIsAccepted(request.uuid));
        // перезапрашиваем список друзей
        store.dispatch(userApi.util.invalidateTags(['friends']));
      });

      // чувак отклонил наш запрос дружбы
      socket.on(msEvents.FRIEND_REQUEST_IS_DECLINED, (request: FriendRequestUuids) => {
        store.dispatch(msActions.outcomingRequestIsDeclined(request.uuid));
      });

      // чувак отозвал свой запрос дружить
      socket.on(msEvents.FRIEND_REQUEST_IS_RECALLED, (request: FriendRequestUuids) => {
        store.dispatch(msActions.incomingFriendRequestIsRecalled(request.uuid));
      });

      // чувак нас выкинул из друзей
      socket.on(msEvents.UNFRIENDED, () => {
        store.dispatch(userApi.util.invalidateTags(['friends']));
      });


      // друг онлайн
      socket.on(msEvents.FRIEND_IS_ONLINE, (userData) => {
        console.log('friend is online', userData);
        store.dispatch(msActions.friendOnline(userData));
      });
      // друг оффлайн
      socket.on(msEvents.FRIEND_IS_OFFLINE, (userData) => {
        // console.log('friend is offline', userData);
        store.dispatch(msActions.friendOffline(userData));
      });
    }

    if (isConnectionEstablished && socket) {

      // отправить запос другому
      if(msActions.sendFriendRequest.match(action)) {
        socket.emit(msEvents.SEND_FRIEND_REQUEST, action.payload);
      }

      // отозвать свой запрос
      if(msActions.recallFriendRequest.match(action)) {
        socket.emit(msEvents.RECALL_FRIEND_REQUEST, action.payload);
      }
      
      // принять входящий запрос
      if(msActions.acceptFriendRequest.match(action)) {
        socket.emit(msEvents.ACCEPT_FRIEND_REQUEST, action.payload);
      }

      // отклонить входящий запрос
      if (msActions.declineFriendRequest.match(action)) {
        socket.emit(msEvents.DECLINE_FRIEND_REQUEST, action.payload);
      }

    }

    next(action);
  }
}

export default messageSystemMiddleware;