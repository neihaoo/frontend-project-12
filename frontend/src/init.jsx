import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Root from './components/Root';
import ErrorPage from './components/ErrorPage';
import LoginPage from './components/LoginPage';
import AuthProvider from "./components/AuthProvider";

const PrivateProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user ? children : <Navigate to='/login' />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <PrivateProvider />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]);

const init = () => {
  return (
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  );
};

export default init;