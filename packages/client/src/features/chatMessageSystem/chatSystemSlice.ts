import { 
  createEntityAdapter, createSlice, PayloadAction, createSelector 
} from "@reduxjs/toolkit";
import { MessageItemResponse } from "@ordinem-megachat-2022/shared";
import { MessageSet } from "@ordinem-megachat-2022/shared";
import { mapValues, pick } from "lodash";

type MessageEntity = MessageItemResponse;


const messagesAdapter = createEntityAdapter<MessageEntity>({
  selectId: (item) => item.uuid,
  sortComparer: (a, b) => {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    }
});

const chatSystemSlice = createSlice({
  name: 'chatSystem',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    setMessages: (
      state, action: PayloadAction<MessageSet>
    ) => {
      const { chatRoomUuid, messages } = action.payload;
      messagesAdapter.upsertMany(
        state, 
        mapValues(messages, (message) => ({ ...message, chatRoomUuid }))
      );
    },
    
    addChatMessage: (
      state, action: PayloadAction<MessageItemResponse>
    ) => {
      messagesAdapter.addOne(state, action.payload);
    }
  }
});


const messageEntitySelectors = messagesAdapter.getSelectors();

export const selectMessagesOfRoom = createSelector(
  [
    messageEntitySelectors.selectEntities,
    messageEntitySelectors.selectIds,
    (state, chatroomUuid) => chatroomUuid
  ],
  (entities, ids, chatroomUuid) => {
    if (!chatroomUuid) return undefined;

    const selectIds = ids.filter(id => entities[id]?.chatRoomUuid === chatroomUuid);

    const selectedEntites = pick(entities, selectIds);
    const result = Object.values(selectedEntites);
    return result as MessageItemResponse[];
  }
);


export const chatSystemActions = chatSystemSlice.actions;
export const chatSystemReducer = chatSystemSlice.reducer;

export default chatSystemSlice;