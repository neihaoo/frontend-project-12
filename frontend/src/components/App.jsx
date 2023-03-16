import { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import ChatPage from './ChatPage';
import LoginPage from './LoginPage';
import ErrorPage from './ErrorPage';

import routes from '../routes';
import { useAuth } from '../hooks';
import { AuthContext } from '../contexts';

const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!userData);

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return !!userData ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAuthHeader, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateOutlet = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={routes.loginPagePath()} />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className='d-flex flex-column h-100'>
        <Navbar />
        <Routes>
          <Route path={routes.loginPagePath()} element={<LoginPage />} />
          <Route path={routes.chatPagePath()} element={<PrivateOutlet />}>
            <Route path='' element={<ChatPage />} />
          </Route>
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;