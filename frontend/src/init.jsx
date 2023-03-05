import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from './components/Root';
import ErrorPage from './components/ErrorPage';
import LoginPage from './components/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]);

const init = () => (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

export default init;