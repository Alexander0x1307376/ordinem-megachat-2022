import { Socket } from "socket.io-client";
import { RootState } from "../../store/store";
import { ChangeData, ChatSystemEvents as csEvents } from "@ordinem-megachat-2022/shared";
import { usersDataActions } from "../users/usersDataSlice";
import { omit } from "lodash";
import { channelsApi } from "../channels/channelsService";
import { groupApi } from "../groups/groupsService";
import { AnyAction, Store } from "@reduxjs/toolkit";


const realtimeSystemReceiver = (socket: Socket, store: Store<RootState, AnyAction>) => {
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
    console.log('USER_ONLINE: ', userUuid);
    store.dispatch(usersDataActions.setUserStatus({ userUuid, status: 'в сети' }));
  });

  socket.on(csEvents.USER_OFFLINE, (userUuid: string) => {
    console.log('USER_OFFLINE: ', userUuid);
    store.dispatch(usersDataActions.removeUser(userUuid));
  });
  
  socket.on(csEvents.CHANGES, (response: ChangeData) => {
    console.log('CHANGES', response);

    // устанавливаем статусы юзеров
    const userData = response.users?.data
      .reduce((acc: any, item: any) => ({
        ...acc, [item.uuid]: omit(item, 'uuid')
      }), {} as Record<string, any>);

    store.dispatch(usersDataActions.setUsersData(userData));

  });

  socket.on(csEvents.CHANGES_SIGNAL, (response: string) => {
    switch(response) {
      case 'group.channels':
        store.dispatch(channelsApi.util.invalidateTags(['channels']));
        store.dispatch(groupApi.util.invalidateTags(['groupDetails']));
      break;
      case 'group.list':
        store.dispatch(groupApi.util.invalidateTags(['userGroups']));
      break;
    }
  })
}

export default realtimeSystemReceiver;