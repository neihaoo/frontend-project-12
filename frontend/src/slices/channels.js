/* eslint-disable no-param-reassign */

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const defaultChannelId = 1;

const adapter = createEntityAdapter();
const initialState = adapter.getInitialState({ currentChannelId: null });

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: adapter.addOne,
    removeChannel: (state, { payload }) => {
      if (state.currentChannelId === payload) {
        state.currentChannelId = defaultChannelId;
      }

      adapter.removeOne(state, payload);
    },
    renameChannel: adapter.updateOne,
    setCurrentChannel: (state, { payload }) => {
      const { channelId } = payload;

      state.currentChannelId = channelId;
    },
    setInitialState: (state, { payload }) => {
      const { channels, currentChannelId } = payload;

      state.currentChannelId = currentChannelId;
      adapter.addMany(state, channels);
    },
  },
});

const selectors = adapter.getSelectors((state) => state.channels);
const { actions } = slice;

export { actions, defaultChannelId, selectors };

export default slice.reducer;
