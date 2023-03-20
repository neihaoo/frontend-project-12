import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();
const initialState = adapter.getInitialState({ currentChannelId: null });

export const defaultChannelId = 1;

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setInitialState: (state, { payload }) => {
      const { channels, currentChannelId } = payload;

      state.ids = channels.ids;
      state.entities = channels.entities;
      state.currentChannelId = currentChannelId;
    },
    setCurrentChannel: (state, { payload }) => {
      const { channelId } = payload;

      state.currentChannelId = channelId;
    },
    addChannel: adapter.addOne,
    removeChannel: (state, { payload }) => {
      if (state.currentChannelId === payload) {
        state.currentChannelId = defaultChannelId;
      }

      adapter.removeOne(state, payload);
    },
    renameChannel: adapter.updateOne,
  },
});

export const selectors = adapter.getSelectors((state) => state.channels);
export const { actions } = slice;

export default slice.reducer;