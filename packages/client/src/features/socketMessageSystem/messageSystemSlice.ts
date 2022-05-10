import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestsInfo } from '@apiTypes/friendRequestTypes';
import { RootState } from "../../store/store";


export interface MessageSystemState {
  isEstablishingConnection: boolean;
  isConnected: boolean;
  friendRequests: RequestsInfo;
}
const initialState: MessageSystemState = {
  isEstablishingConnection: false,
  isConnected: false,
  friendRequests: {
    requestsToUser: [],
    userRequests: []
  }
};

const messageSystemSlice = createSlice({
  name: 'messageSystem',
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
    setFriendRequests: (state, action: PayloadAction<RequestsInfo>) => {
      state.friendRequests = action.payload;
    },

    // отправка запроса (мы - стороннему чуваку)
    sendFriendRequest: (state, action: PayloadAction<string>) => {
      
    },
    sendFriendRequestSucsess: (state, action: PayloadAction<string>) => {
      
    },

    // отзыв запроса (который мы отправили ранее)
    recallFriendRequest: (state, action: PayloadAction<string>) => {

    },
    recallFriendRequestSucsess: (state, action: PayloadAction<string>) => {

    },


    // получание запроса (сторонний чувак - нам)
    incomingFriendRequest: (state, action: PayloadAction<any>) => {

    },
    incomingFriendRequestSucsess: (state, action: PayloadAction<any>) => {

    },

    // принять запрос (от стороннего чувака - нам)
    acceptFriendRequest: (state, action: PayloadAction<string>) => {

    }, 
    acceptFriendRequestSucsess: (state, action: PayloadAction<string>) => {

    }, 

    // отклонить запрос (от стороннего чувака - нам)
    declineFriendRequest: (state, action: PayloadAction<string>) => {

    }, 
    declineFriendRequestSucsess: (state, action: PayloadAction<string>) => {

    }, 


    // 
  }
});

export const messageSystemActions = messageSystemSlice.actions;

export const messageSystemReducer = messageSystemSlice.reducer;

export const selectFriendRequests = (state: RootState) => {
  return state.messageSystem.friendRequests;
}

export default messageSystemSlice;
