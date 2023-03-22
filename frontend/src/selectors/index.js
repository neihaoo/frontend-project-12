import { createSelector } from '@reduxjs/toolkit';

const selectMessages = ({ messages }) => Object.values(messages.entities);
const selectChannels = ({ channels }) => Object.values(channels.entities);
const selectCurrentChannelId = ({ channels }) => channels.currentChannelId;

export const selectCurrentChannel = createSelector(
  selectChannels,
  selectCurrentChannelId,
  (channels, currentChannelId) => channels.find(({ id }) => id === currentChannelId),
);

export const selectCurrentChannelMessages = createSelector(
  selectMessages,
  selectCurrentChannelId,
  (messages, currentChannelId) => (
    messages.filter(({ channelId }) => channelId === currentChannelId)
  ),
);

export const selectChannelsNames = createSelector(
  selectChannels,
  (channels) => channels.map(({ name }) => name),
);
