import { remove } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channelsSlice.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { messages: [] },
  reducers: {
    addMessage(state, { payload }) {
      const { message } = payload;

      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, { payload }) => {
        const { channelId } = payload;

        remove(state.messages, (message) => message.channelId === channelId);
      })
      .addCase(channelsActions.setInitialState, (state, { payload }) => {
        const { messages } = payload;

        state.messages = messages;
      });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;