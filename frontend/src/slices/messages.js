import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channels.js';

const adapter = createEntityAdapter();
const initialState = adapter.getInitialState();

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: adapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, { payload }) => {
        const restMessages = Object.values(state.entities)
          .filter(({ channelId }) => channelId !== payload);

        adapter.setAll(state, restMessages);
      })
      .addCase(channelsActions.setInitialState, (state, { payload }) => {
        const { messages } = payload;

        state.ids = messages.ids;
        state.entities = messages.entities;
      });
  },
});

export const selectors = adapter.getSelectors((state) => state.messages);
export const { actions } = slice;

export default slice.reducer;
