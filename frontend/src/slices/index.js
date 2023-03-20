import { configureStore } from '@reduxjs/toolkit';

import channels from './channels';
import messages from './messages';
import modal from './modal';

export default configureStore({
  reducer: { channels, messages, modal },
});