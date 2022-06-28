import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";
import { authApi } from "../features/auth/authService";
import { groupApi } from "../features/groups/groupsService";
import { userApi } from "../features/users/usersService";
import { channelsApi } from "../features/channels/channelsService";
import { friendfhipSystemReducer } from "../features/friendshipSystem/friendshipSystemSlice";
import { chatSystemReducer } from "../features/chatMessageSystem/chatSystemSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    chatSystem: chatSystemReducer,
    friendshipSystem: friendfhipSystemReducer,
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