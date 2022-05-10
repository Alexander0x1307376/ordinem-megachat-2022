import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import {checkTokenExpiration} from '../utils/authUtils';
import { RootState } from './store';


export interface UserState {
  userData: User,
  accessToken: string,
  refreshToken: string
}


const getUserFromLocalStorage = (): UserState | undefined => {

  const userFromStorage = localStorage.getItem('user');

  const userData = userFromStorage ? JSON.parse(userFromStorage) as UserState : undefined;
  if(!userData) {
    return undefined;
  }

  const checkExpiration = checkTokenExpiration(userData.refreshToken);
  if (checkExpiration) {
    return undefined;
  }

  return userData;
}


const initialState: UserState = getUserFromLocalStorage() || {
  userData: {
    uuid: '',
    name: '',
  },
  accessToken: '',
  refreshToken: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUser: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
      return state;
    },

    clearUser: (state) => {
      state = initialState;
      return state;
    }
    
  }
})

export const {setUser, clearUser} = userSlice.actions;
export const authReducer = userSlice.reducer;

export const selectCurrentUser = (state: RootState) => {
  return state.auth.userData;
};