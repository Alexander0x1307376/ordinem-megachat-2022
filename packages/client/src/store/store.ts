import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";
import { authApi } from "../features/auth/authService";
import { groupApi } from "../features/groups/groupsService";
import { userApi } from "../features/users/usersService";
import { channelsApi } from "../features/channels/channelsService";
import { chatSystemReducer } from "../features/chatMessageSystem/chatSystemSlice";
import { usersDataReducer } from "../features/users/usersDataSlice";
import { realtimeSystemReducer } from "../features/realtimeSystem/realtimeSystemSlice";
import { imagesApi } from "../features/images/imageService";
import { friendRequestApi } from "../features/friendshipSystem/friendRequestsService";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
    [friendRequestApi.reducerPath]: friendRequestApi.reducer,
    chatSystem: chatSystemReducer,
    auth: authReducer,
    usersData: usersDataReducer,
    realtimeSystem: realtimeSystemReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    authApi.middleware,
    groupApi.middleware,
    userApi.middleware,
    channelsApi.middleware,
    imagesApi.middleware,
    friendRequestApi.middleware
  ])
});

export type RootState = ReturnType<typeof store.getState>;

export type StoreType = typeof store;
export type AppDispatch = typeof store.dispatch;