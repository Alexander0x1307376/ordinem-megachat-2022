import { configureStore } from "@reduxjs/toolkit";
import messageSystemMiddleware from "../features/socketMessageSystem/messageSystemMiddleware";
import { authReducer } from "./authSlice";
import { authApi } from "./services/authService";
// import { friendRequestApi } from "./services/friendRequestsService";
import { friendRequestApi } from "./services/webSocketFriendRequestsService";
import { groupApi } from "./services/groupsService";
import { userApi } from "./services/usersService";
import { messageSystemReducer } from "../features/socketMessageSystem/messageSystemSlice"; 

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [friendRequestApi.reducerPath]: friendRequestApi.reducer,
    messageSystem: messageSystemReducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    authApi.middleware,
    groupApi.middleware,
    userApi.middleware,
    friendRequestApi.middleware,
    messageSystemMiddleware,
  ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;