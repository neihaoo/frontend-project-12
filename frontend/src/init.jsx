import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { Provider } from 'react-redux';
import { setLocale } from 'yup';

import App from './components/App';

import reducer, { actions } from './slices';
import { ApiContext } from './contexts';
import resources from './locales';

const init = async (socket) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const withAcknowledgement = (event) => (args) =>
    new Promise((resolve, reject) => {
      socket.timeout(5000).volatile.emit(event, args, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.data);
        }
      });
    });

  const api = {
    addChannel: withAcknowledgement('newChannel'),
    removeChannel: withAcknowledgement('removeChannel'),
    renameChannel: withAcknowledgement('renameChannel'),
    sendMessage: withAcknowledgement('newMessage'),
  };

  const store = configureStore({
    reducer,
  });

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: isProduction,
    environment: process.env.NODE_ENV,
  };

  const i18nextInstance = i18next.createInstance();

  await i18nextInstance.use(initReactI18next).init({
    lng: 'ru',
    resources,
  });

  setLocale({
    mixed: {
      notOneOf: 'modals.unique',
      required: 'errors.required',
    },
    string: {
      max: ({ max }) => ({ key: 'errors.max', values: { max } }),
      min: ({ min }) => ({ key: 'errors.min', values: { min } }),
    },
  });

  socket.on('newMessage', (payload) => {
    store.dispatch(actions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(actions.addChannel(payload));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(actions.removeChannel(id));
  });
  socket.on('renameChannel', ({ id, name }) => {
    store.dispatch(
      actions.renameChannel({
        changes: { name },
        id,
      })
    );
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
