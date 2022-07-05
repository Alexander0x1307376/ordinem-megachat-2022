import {
  createEntityAdapter, createSlice, EntityState, PayloadAction, createSelector
} from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { getUserFromLocalStorage } from "../../utils/authUtils";


export type UserDataState = {
  userStatuses: Record<string, {status: string}>;
}


const currentUser = getUserFromLocalStorage();
const userUuid = currentUser?.userData.uuid;

const initialState: UserDataState = {
  userStatuses: userUuid 
  ? { [userUuid]: {status: 'в сети'} } 
  : {}
}

const usersDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUsersStatuses: (state, action: PayloadAction<Record<string, { status: string }>>) => {
      state.userStatuses = Object.assign(state.userStatuses, action.payload);
    },
    setUserStatus: (state, action: PayloadAction<{ userUuid: string, status: string }>) => {
      console.log('setUserStatus');
      const { userUuid, status } = action.payload;
      state.userStatuses[userUuid] = { status };
    },
    removeUser: (state, action: PayloadAction<string>) => {
      delete state.userStatuses[action.payload];
    }
  }
});


export const selectUsersData = (state: RootState) => {
  return state.usersData.userStatuses;
}

export const usersDataActions = usersDataSlice.actions;
export const usersDataReducer = usersDataSlice.reducer;

export default usersDataSlice;