import { combineReducers } from '@reduxjs/toolkit';

import channels, {
  actions as channelsActions,
  selectors as channelsSelectors,
  defaultChannelId,
} from './channels';
import messages, {
  actions as messagesActions,
  selectors as messagesSelectors,
} from './messages';
import modal, { actions as modalActions } from './modal';

const actions = {
  ...channelsActions,
  ...messagesActions,
  ...modalActions,
};

const selectors = {
  channelsSelectors,
  messagesSelectors,
};

export { actions, defaultChannelId, selectors };

export default combineReducers({
  channels,
  messages,
  modal,
});
