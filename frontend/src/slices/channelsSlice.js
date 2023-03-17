import { remove } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

export const defaultChannelId = 1;

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { channels: [], currentChannelId: null },
  reducers: {
    setInitialState(state, { payload }) {
      const { channels, currentChannelId } = payload;

      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
    setCurrentChannel(state, { payload }) {
      const { channelId } = payload;

      state.currentChannelId = channelId;
    },
    addChannel(state, { payload }) {
      const { channel } = payload;

      state.channels.push(channel);
    },
    removeChannel(state, { payload }) {
      const { channelId } = payload;

      remove(state.channels, ({ id }) => id === channelId);

      if (state.currentChannelId === channelId) {
        state.currentChannelId = defaultChannelId;
      }
    },
    renameChannel(state, { payload }) {
      const { channelId, channelName } = payload;
      const channel = state.channels.find(({ id }) => id === channelId);

      channel.name = channelName;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;