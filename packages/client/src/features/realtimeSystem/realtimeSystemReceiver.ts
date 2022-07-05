import { Socket } from "socket.io-client";
import { store as mainStore } from "../../store/store";
import { ChatSystemEvents as csEvents, ChangeData } from "@ordinem-megachat-2022/shared";
import { realtimeSystemActions } from "./realtimeSystemSlice";
import { usersDataActions } from "../users/usersDataSlice";

const realtimeSystemReceiver = (socket: Socket, store: typeof mainStore) => {
  socket.on('connect', () => {
    // store.dispatch(msActions.connectionEstablished());
    console.log('RealtimeSystem: connection established!');

    const syncData = store.getState().realtimeSystem;
    if (syncData.channels.length && syncData.users.length && syncData.groups.length)
      setTimeout(() => socket.emit(csEvents.SUBSCRIBE_TO_CHANGES, syncData), 200);
  });

  socket.on('disconnect', () => {
    console.log('RealtimeSystem: connection lost!');
  });

  socket.on(csEvents.USER_ONLINE, (userUuid: string) => {
    store.dispatch(usersDataActions.setUserStatus({ userUuid, status: 'в сети' }));
  });

  socket.on(csEvents.USER_OFFLINE, (userUuid: string) => {
    store.dispatch(usersDataActions.removeUser(userUuid));
  });
  
  socket.on(csEvents.CHANGES, (response: Partial<ChangeData>) => {
    store.dispatch(realtimeSystemActions.setRealtimeState(response));
  });
}

export default realtimeSystemReceiver;