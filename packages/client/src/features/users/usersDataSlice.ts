import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { getUserFromLocalStorage } from "../../utils/authUtils";

export type UserDataState = {
  users: Record<string, {status: string}>;
}


const currentUser = getUserFromLocalStorage();
const userUuid = currentUser?.userData.uuid;

const initialState: UserDataState = {
  users: userUuid 
  ? { [userUuid]: {status: 'в сети'} } 
  : {}
}

const usersDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUsersData: (state, action: PayloadAction<Record<string, { status: string }>>) => {
      state.users = Object.assign(state.users, action.payload);
    },
    setUserStatus: (state, action: PayloadAction<{ userUuid: string, status: string }>) => {
      const { userUuid, status } = action.payload;
      state.users[userUuid] = { status };
    },
    removeUser: (state, action: PayloadAction<string>) => {
      delete state.users[action.payload];
    }
  }
});


export const selectUsersData = (state: RootState) => {
  return state.usersData.users;
}

export const usersDataActions = usersDataSlice.actions;
export const usersDataReducer = usersDataSlice.reducer;

export default usersDataSlice;