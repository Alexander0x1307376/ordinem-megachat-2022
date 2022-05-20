import { configureStore } from "@reduxjs/toolkit";
import messageSystemMiddleware from "../features/socketMessageSystem/messageSystemMiddleware";
import { friendfhipSystemReducer } from "../features/socketMessageSystem/friendshipSystemSlice";
import { authReducer } from "./authSlice";
import { authApi } from "./services/authService";
import { groupApi } from "./services/groupsService";
import { userApi } from "./services/usersService";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    messageSystem: friendfhipSystemReducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    authApi.middleware,
    groupApi.middleware,
    userApi.middleware,
    messageSystemMiddleware
  ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;