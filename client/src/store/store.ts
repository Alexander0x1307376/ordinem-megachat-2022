import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { authApi } from "./services/authService";
import { friendRequestApi } from "./services/friendRequestsService";
import { groupApi } from "./services/groupsService";
import { userApi } from "./services/usersService";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [friendRequestApi.reducerPath]: friendRequestApi.reducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    authApi.middleware,
    groupApi.middleware,
    userApi.middleware,
    friendRequestApi.middleware
  ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;