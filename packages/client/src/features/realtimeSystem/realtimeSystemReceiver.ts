import { Socket } from "socket.io-client";
import { store as mainStore } from "../../store/store";
import { ChangeData, ChatSystemEvents as csEvents, SubscribeToChangeData } from "@ordinem-megachat-2022/shared";
import { realtimeSystemActions } from "./realtimeSystemSlice";
import { usersDataActions } from "../users/usersDataSlice";
import { omit } from "lodash";

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
  
  socket.on(csEvents.CHANGES, (response: ChangeData) => {

    // устанавливаем статусы юзеров
    const userData = response.users?.data
      .reduce((acc: any, item: any) => ({
        ...acc, [item.uuid]: omit(item, 'uuid')
      }), {} as Record<string, any>);

    store.dispatch(usersDataActions.setUsersData(userData));

  });
}

export default realtimeSystemReceiver;