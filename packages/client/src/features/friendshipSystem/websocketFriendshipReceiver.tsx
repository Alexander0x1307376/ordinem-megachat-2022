import { Socket } from "socket.io-client";
import { RequestsInfo, FriendshipSystemEvents as fsEvents, FriendRequest, FriendRequestUuids } from '@ordinem-megachat-2022/shared';
import { friendshipSystemActions as msActions } from "./friendshipSystemSlice";
import { AnyAction, Store } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

// принимает сообщения от вебсокет-сервера и правит стейт соответствующим образом
const websocketFriendshipReceiver = (
  socket: Socket, store: Store<RootState, AnyAction>
) => {

  // ставим состояние "соединение установлено" и запрашиваем по сокету данные с сервера
  socket.on('connect', () => {
    store.dispatch(msActions.connectionEstablished());
    console.log('FriendshipSystem: connection established!');

    // по неясной причине запрос не отправляется моментально, поэтому так
    setTimeout(() => socket.emit(fsEvents.REQUEST_INFO), 200);
  });

  // подписываемся на сокет-сообщения

  // запрос всей информации о запросах дружбы
  socket.on(fsEvents.REQUEST_INFO_SUCCESS, (requestData: RequestsInfo) => {
    store.dispatch(msActions.setFriendInfo(requestData));
  });

  // запрос дружить успешно отправлен
  socket.on(fsEvents.SEND_FRIEND_REQUEST_SUCCESS, (requestData: FriendRequest) => {
    store.dispatch(msActions.sendFriendRequestSucsess(requestData));
  });

  // когда запрос дружбы отправлен при наличии встречного запроса
  socket.on(fsEvents.SEND_FRIEND_REQUEST_SUCCESS_ACCEPT, (requestData: FriendRequest) => {
    // store.dispatch(userApi.util.invalidateTags(['friends']));
    socket.emit(fsEvents.REQUEST_INFO);
  });

  // сервер сообщает нам об успешном принятии нами запроса дружбы
  socket.on(fsEvents.ACCEPT_FRIEND_REQUEST_SUCCESS, (request: FriendRequestUuids) => {
    store.dispatch(msActions.acceptFriendRequestSucsess(request.uuid));
    // перезапрашиваем список друзей
    // store.dispatch(userApi.util.invalidateTags(['friends']));
  });

  // отмена нами запроса дружбы обработана
  socket.on(fsEvents.DECLINE_FRIEND_REQUEST_SUCCESS, (request: FriendRequestUuids) => {
    store.dispatch(msActions.declineFriendRequestSucsess(request.uuid));
  });

  // мы успешно отозвали наш собственный запрос дружить
  socket.on(fsEvents.RECALL_FRIEND_REQUEST_SUCCESS, (request: FriendRequestUuids) => {
    store.dispatch(msActions.recallFriendRequestSucsess(request.uuid));
  });

  // входящие запросы

  // к нам пришёл запрос дружбы
  socket.on(fsEvents.INCOMING_FRIEND_REQUEST, (friendRequest: FriendRequest) => {
    store.dispatch(msActions.incomingFriendRequest(friendRequest));
  });

  // чувак принял наш запрос дружить
  socket.on(fsEvents.FRIEND_REQUEST_IS_ACCEPTED, (request: FriendRequestUuids) => {
    store.dispatch(msActions.outcomingRequestIsAccepted(request.uuid));
    // перезапрашиваем список друзей
    // store.dispatch(userApi.util.invalidateTags(['friends']));
  });

  // чувак отклонил наш запрос дружбы
  socket.on(fsEvents.FRIEND_REQUEST_IS_DECLINED, (request: FriendRequestUuids) => {
    store.dispatch(msActions.outcomingRequestIsDeclined(request.uuid));
  });

  // чувак отозвал свой запрос дружить
  socket.on(fsEvents.FRIEND_REQUEST_IS_RECALLED, (request: FriendRequestUuids) => {
    store.dispatch(msActions.incomingFriendRequestIsRecalled(request.uuid));
  });

  // чувак нас выкинул из друзей
  socket.on(fsEvents.UNFRIENDED, () => {
    // store.dispatch(userApi.util.invalidateTags(['friends']));
  });


  // друг онлайн
  socket.on(fsEvents.FRIEND_IS_ONLINE, (userData) => {
    store.dispatch(msActions.friendOnline(userData));
  });
  // друг оффлайн
  socket.on(fsEvents.FRIEND_IS_OFFLINE, (userData) => {
    store.dispatch(msActions.friendOffline(userData));
  });

  socket.on(fsEvents.FRIEND_STATUSES, (statusesData) => {
    store.dispatch(msActions.setFriendStatuses(statusesData));
  });
}

export default websocketFriendshipReceiver;