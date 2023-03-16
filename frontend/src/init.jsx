import { Provider } from 'react-redux';

import store from './slices';
import App from './components/App';

const init = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default init;