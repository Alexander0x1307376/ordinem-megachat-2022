import { Socket } from "socket.io-client";
import { ChatSystemEvents as chatEvents, MessageItemResponse, MessageSet } from "@ordinem-megachat-2022/shared";
import { store as mainStore } from "../../store/store";
import { chatSystemActions } from "./chatSystemSlice";

const websocketChatMessageReceiver = (socket: Socket, store: typeof mainStore) => {

  socket.on(chatEvents.JOIN_ROOM_SUCCESS, (response: MessageSet) => {
    // console.log('chatEvents.JOIN_ROOM_SUCCESS!');
    store.dispatch(chatSystemActions.setMessages(response));
  });

  socket.on(chatEvents.JOIN_ROOM_ERROR, (response) => {
    console.error('something gone wrong while joining channel!', response);
  });

  socket.on(chatEvents.LEAVE_ROOM_SUCCESS, () => {
    // console.log('chatEvents.LEAVE_ROOM_SUCCESS!');
  });

  socket.on(chatEvents.LEAVE_ROOM_ERROR, (response) => {
    // console.log('chatEvents.LEAVE_ROOM_ERROR!', response);
  });

  socket.on(chatEvents.REQUEST_CHAT_MESSAGES_SUCCESS, (response: MessageSet) => {
    store.dispatch(chatSystemActions.setMessages(response));
  });

  socket.on(chatEvents.NEW_MESSAGE, (response: MessageItemResponse) => {
    store.dispatch(chatSystemActions.addChatMessage(response));
  });
}

export default websocketChatMessageReceiver;