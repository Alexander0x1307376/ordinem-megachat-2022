import { 
  createEntityAdapter, createSlice, EntityState, PayloadAction, createSelector 
} from "@reduxjs/toolkit";
import { Channel, MessageItemResponse } from "@ordinem-megachat-2022/shared";
import { RootState } from "../../store/store";
import { MessageSet } from "@ordinem-megachat-2022/shared";
import { mapValues, pick, pickBy } from "lodash";


type ChannelEntity = Pick<Channel, "uuid">;
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
      const { channelUuid, messages } = action.payload;
      messagesAdapter.upsertMany(
        state, 
        mapValues(messages, (message) => ({...message, channelUuid}))
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

export const selectMessagesOfChannel = createSelector(
  [
    messageEntitySelectors.selectEntities,
    messageEntitySelectors.selectIds,
    (state, channelUuid) => channelUuid
  ],
  (entities, ids, channelUuid) => {
    if (!channelUuid) return undefined;

    const selectIds = ids.filter(id => entities[id]?.channelUuid === channelUuid);

    const selectedEntites = pick(entities, selectIds);
    const result = Object.values(selectedEntites);
    return result as MessageItemResponse[];
  }
);

// export const selectMessagesOfChannel = (channelUuid: string) => (state: RootState) => {
//   if (!channelUuid) return undefined;
//   const { ids, entities } = state.chatSystem.messages;
//   const selectedEntites = pickBy(entities, (value) => value!.channelUuid === channelUuid);
//   const result = Object.values(selectedEntites);
//   return result;
// };



export const chatSystemActions = chatSystemSlice.actions;
export const chatSystemReducer = chatSystemSlice.reducer;

export default chatSystemSlice;