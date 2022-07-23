import { Socket } from "socket.io-client";
import { store as mainStore } from "../../store/store";
import { ChatSystemEvents as chatEvents } from "@ordinem-megachat-2022/shared";
import { usersDataActions } from "./usersDataSlice";

const websocketUsersDataReceiver = (socket: Socket, store: typeof mainStore) => {
  // socket.on(chatEvents.USER_ONLINE, (response) => {
  //   store.dispatch(usersDataActions.setUserStatus(response));
  // });
}

export default websocketUsersDataReceiver;