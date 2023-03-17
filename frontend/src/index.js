import { StrictMode } from 'react';
import { io } from 'socket.io-client';
import { createRoot } from 'react-dom';

import init from './init';
import reportWebVitals from './reportWebVitals';

import './assets/application.scss';

const app = async () => {
  const root = createRoot(document.getElementById('chat'));
  const socket = io();
  const vdom = await init(socket);

  root.render(<StrictMode>{vdom}</StrictMode>);
};

app();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();