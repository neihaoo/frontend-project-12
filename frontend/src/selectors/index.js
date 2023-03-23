import { createSelector } from '@reduxjs/toolkit';

const selectMessages = ({ messages }) => Object.values(messages.entities);
const selectChannels = ({ channels }) => Object.values(channels.entities);
const selectCurrentChannelId = ({ channels }) => channels.currentChannelId;

const selectCurrentChannel = createSelector(
  selectChannels,
  selectCurrentChannelId,
  (channels, currentChannelId) => (
    channels.find(({ id }) => id === currentChannelId)
  ),
);

const selectCurrentChannelMessages = createSelector(
  selectMessages,
  selectCurrentChannelId,
  (messages, currentChannelId) => (
    messages.filter(({ channelId }) => channelId === currentChannelId)
  ),
);

const selectChannelsNames = createSelector(
  selectChannels,
  (channels) => channels.map(({ name }) => name),
);

export {
  selectChannelsNames,
  selectCurrentChannel,
  selectCurrentChannelMessages,
};
