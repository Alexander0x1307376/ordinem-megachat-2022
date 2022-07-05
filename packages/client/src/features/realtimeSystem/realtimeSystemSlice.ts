import {
  createSlice, PayloadAction
} from "@reduxjs/toolkit";
import { difference, isArray, merge, mergeWith, uniq } from "lodash";
import { RootState } from "../../store/store";
import { ChangeData } from "@ordinem-megachat-2022/shared";

export type RealtimeState = ChangeData;

export type SetActionPayload = Partial<RealtimeState>;

export type UnsetActionPayload = Partial<RealtimeState>

const initialState: RealtimeState = {
  users: [],
  channels: [],
  groups: []
};

const realtimeSystemSlice = createSlice({
  name: 'realtimeData',
  initialState,
  reducers: {
    setRealtimeState: (state, action: PayloadAction<SetActionPayload>) => {
      mergeWith(state, action.payload, (objValue, srcValue) => {
        if (isArray(objValue)) 
          return uniq(objValue.concat(srcValue));
      });
    },
    removeRealtimeState: (state, action: PayloadAction<UnsetActionPayload>) => {
      const { channels, groups, users } = action.payload;

      state.groups = difference(state.groups, groups || []);
      state.channels = difference(state.channels, channels || []);
      state.users = difference(state.users, users || []);
    },


    upsertUsers: (state, action: PayloadAction<string[]>) => {
      state.users = uniq(state.users.concat(action.payload));
    },
    setGroup: (state, action: PayloadAction<string>) => {
      state.groups = [action.payload];
    },
    setChannel: (state, action: PayloadAction<string>) => {
      state.channels = [action.payload];
    },


    unsetUsers: (state, action: PayloadAction<string[]>) => {
      state.users = difference(state.users, action.payload);
    },
    unsetGroup: (state) => {
      state.groups = [];
    },
    unsetChannel: (state) => {
      state.channels = [];
    },
  }
});

export const realtimeSystemActions = realtimeSystemSlice.actions;
export const realtimeSystemReducer = realtimeSystemSlice.reducer;

export default realtimeSystemSlice;