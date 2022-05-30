import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { authApi } from "./services/authService";
import { groupApi } from "./services/groupsService";
import { userApi } from "./services/usersService";
import { channelsApi } from "./services/channelsService";
import { friendfhipSystemReducer } from "../features/socketMessageSystem/friendshipSystemSlice";
import { chatSystemReducer } from "../features/socketMessageSystem/chatSystemSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    chatSystem: chatSystemReducer,
    messageSystem: friendfhipSystemReducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    authApi.middleware,
    groupApi.middleware,
    userApi.middleware,
    channelsApi.middleware
  ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;