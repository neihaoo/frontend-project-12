import { Provider } from 'react-redux';

import store from './slices';
import App from './components/App';
import { ApiContext } from './contexts';
import { actions as messagesActions } from './slices/messagesSlice';

const withAcknowledgement = (fn) => (...args) => new Promise((resolve, reject) => {
  let state = 'pending';

  const timer = setTimeout(() => {
    state = 'rejected';

    reject();
  }, 5000);

  fn(...args, (response) => {
    if (state !== 'pending') {
      return;
    };

    clearTimeout(timer);

    if (response.status === 'ok') {
      state = 'resolved';

      resolve();
    }

    reject();
  });
});

const init = async (socket) => {
  const api = {
    sendMessage: withAcknowledgement((...args) => socket.volatile.emit('newMessage', ...args)),
  };

  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage({ message: payload }));
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