import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestsInfo, FriendRequest } from '@ordinem-megachat-2022/shared';
import { RootState } from "../../store/store";


export interface MessageSystemState {
  isEstablishingConnection: boolean;
  isConnected: boolean;
  friendRequests: RequestsInfo['friendRequests'];
  friendsOnline: RequestsInfo['friendsStatuses'];
}
const initialState: MessageSystemState = {
  isEstablishingConnection: false,
  isConnected: false,
  friendRequests: {
    incomingRequests: [],
    outcomingRequests: []
  },
  friendsOnline: {}
};

const friendshipSystemSlice = createSlice({
  name: 'friendshipSystem',
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },

    // запрос всей информации о запросах дружбы
    setFriendInfo: (state, action: PayloadAction<RequestsInfo>) => {
      state.friendRequests = action.payload.friendRequests;
      state.friendsOnline = action.payload.friendsStatuses;
    },

    setFriendStatuses:(state, action: PayloadAction<any>) => {
      state.friendsOnline = action.payload;
    },

    // отправка запроса (мы - стороннему чуваку)
    sendFriendRequest: (state, action: PayloadAction<string>) => {},
    sendFriendRequestSucsess: ({friendRequests: {outcomingRequests}}, action: PayloadAction<FriendRequest>) => {
      const index = outcomingRequests.findIndex(item => item.uuid === action.payload.uuid);
      if(index === -1)
        outcomingRequests.push(action.payload);
      else
        outcomingRequests[index] = action.payload;
    },

    // отзыв запроса (который мы отправили ранее)
    recallFriendRequest: (state, action: PayloadAction<string>) => {},
    recallFriendRequestSucsess: (state, action: PayloadAction<string>) => {
      const newOutcomingRequests = state.friendRequests.outcomingRequests.filter(item => item.uuid !== action.payload);
      state.friendRequests.outcomingRequests = newOutcomingRequests;
      return state;
    },

    // принять запрос (от стороннего чувака - нам)
    acceptFriendRequest: (state, action: PayloadAction<string>) => {}, 
    acceptFriendRequestSucsess: (state, action: PayloadAction<string>) => {
      const newIncomingRequests = state.friendRequests.incomingRequests.filter(item => item.uuid !== action.payload);
      state.friendRequests.incomingRequests = newIncomingRequests;
      return state;
    }, 

    // отклонить запрос (от стороннего чувака - нам)
    declineFriendRequest: (state, action: PayloadAction<string>) => {}, 
    declineFriendRequestSucsess: (state, action: PayloadAction<string>) => {
      const newIncomingRequests = state.friendRequests.incomingRequests.filter(item => item.uuid !== action.payload);
      state.friendRequests.incomingRequests = newIncomingRequests;
      return state;
    }, 

    // получание запроса (сторонний чувак - нам)
    incomingFriendRequest: ({ friendRequests: { incomingRequests } }, action: PayloadAction<FriendRequest>) => {
      const index = incomingRequests.findIndex(item => item.uuid === action.payload.uuid);
      if(index === -1)
        incomingRequests.push(action.payload);
      else
        incomingRequests[index] = action.payload;
    },
    
    // сторонний чувак отозвал свой запрос, что прислал ранее
    incomingFriendRequestIsRecalled: (state, action: PayloadAction<string>) => {
      const newIncomingRequests = state.friendRequests.incomingRequests.filter(item => item.uuid !== action.payload);
      state.friendRequests.incomingRequests = newIncomingRequests;
      return state;
    },

    // сторонний чувак принял наш реквест
    outcomingRequestIsAccepted: (state, action: PayloadAction<string>) => {
      const newOutcomingRequests = state.friendRequests.outcomingRequests.filter(item => item.uuid !== action.payload);
      state.friendRequests.outcomingRequests = newOutcomingRequests;
      return state;
    },

    // сторонний чувак отклонил наш реквест :(
    outcomingRequestIsDeclined: (state, action: PayloadAction<string>) => {
      const newOutcomingRequests = state.friendRequests.outcomingRequests.filter(item => item.uuid !== action.payload);
      state.friendRequests.outcomingRequests = newOutcomingRequests;
      return state;
    },


    friendOnline: (state, action: PayloadAction<{ uuid: string, status: string }>) => {
      console.log('friendOnline', action.payload);
      state.friendsOnline[action.payload.uuid] = { status: action.payload.status };
    },
    friendOffline: (state, action: PayloadAction<{ uuid: string }>) => {
      delete state.friendsOnline[action.payload.uuid];
    },
  }
});

export const friendshipSystemActions = friendshipSystemSlice.actions;

export const friendfhipSystemReducer = friendshipSystemSlice.reducer;

export const selectFriendRequests = (state: RootState) => {
  return state.friendshipSystem.friendRequests;
}

export const selectFriendStatuses = (state: RootState) => {
  return state.friendshipSystem.friendsOnline;
}

export default friendshipSystemSlice;
