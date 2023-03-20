import { Provider } from 'react-redux';

import store from './slices';
import App from './components/App';
import { ApiContext } from './contexts';
import { actions as messagesActions } from './slices/messages';
import { actions as channelsActions } from './slices/channels';

const withAcknowledgement = (fn) => (...args) => new Promise((resolve, reject) => {
  let state = 'pending';

  const timer = setTimeout(() => {
    state = 'rejected';

    reject();
  }, 5000);

  fn(...args, ({ status, data }) => {
    if (state !== 'pending') {
      return;
    };

    clearTimeout(timer);

    if (status === 'ok') {
      state = 'resolved';
      
      resolve(data);
    }

    reject();
  });
});

const init = async (socket) => {
  const api = {
    sendMessage: withAcknowledgement((...args) => socket.volatile.emit('newMessage', ...args)),
    addChannel: withAcknowledgement((...args) => socket.volatile.emit('newChannel', ...args)),
    renameChannel: withAcknowledgement((...args) => socket.volatile.emit('renameChannel', ...args)),
    removeChannel: withAcknowledgement((...args) => socket.volatile.emit('removeChannel', ...args)),
  };

  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(channelsActions.removeChannel(id));
  });
  socket.on('renameChannel', ({ id, name }) => {
    store.dispatch(channelsActions.renameChannel({
      id,
      changes: { name },
    }));
  });

  return (
    <Provider store={store}>
      <ApiContext.Provider value={api}>
        <App />
      </ApiContext.Provider>
    </Provider>
  );
};

export default init;