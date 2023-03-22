import { StrictMode } from 'react';
import { io } from 'socket.io-client';
import { createRoot } from 'react-dom';

import init from './init';

import './assets/application.scss';

const app = async () => {
  const root = createRoot(document.getElementById('chat'));
  const socket = io();
  const vdom = await init(socket);

  root.render(<StrictMode>{vdom}</StrictMode>);
};

app();
