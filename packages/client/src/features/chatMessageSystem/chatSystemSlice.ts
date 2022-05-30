import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// каналы и их сообщения
export type ChatSystemState = {
  channels: Record<string, {
    uuid: string;
    authorUuid: string;
    authorName: string;
    authorAvaPath: string;
    createdAt: string;
    updatedAt: string;
  }>
}

const initialState: ChatSystemState = {
  channels: {}
}

const chatSystemSlice = createSlice({
  name: 'chatSystem',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<any>) => {

    },
    addChatMessage: (state, action: PayloadAction<any>) => {

    }
  }
});


export const chatSystemActions = chatSystemSlice.actions;
export const chatSystemReducer = chatSystemSlice.reducer;

export default chatSystemSlice;