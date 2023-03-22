import i18next from 'i18next';
import { setLocale } from 'yup';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import store from './slices';
import resources from './locales';
import App from './components/App';
import { ApiContext } from './contexts';
import { actions as messagesActions } from './slices/messages';
import { actions as channelsActions } from './slices/channels';

const init = async (socket) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const withAcknowledgement = (event) => (...args) => new Promise((resolve, reject) => {
    socket.timeout(5000).volatile.emit(event, ...args, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.data);
      }
    });
  });

  const api = {
    sendMessage: withAcknowledgement('newMessage'),
    addChannel: withAcknowledgement('newChannel'),
    renameChannel: withAcknowledgement('renameChannel'),
    removeChannel: withAcknowledgement('removeChannel'),
  };

  const rollbarConfig = {
    enabled: isProduction,
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    environment: process.env.NODE_ENV,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  const i18nextInstance = i18next.createInstance();

  await i18nextInstance
    .use(initReactI18next)
    .init({
      lng: 'ru',
      resources,
    });

  setLocale({
    mixed: {
      notOneOf: 'modals.unique',
      required: 'errors.required',
    },
    string: {
      min: ({ min }) => ({ key: 'errors.min', values: { min } }),
      max: ({ max }) => ({ key: 'errors.max', values: { max } }),
    },
  });

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
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18nextInstance}>
            <ApiContext.Provider value={api}>
              <App />
            </ApiContext.Provider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;