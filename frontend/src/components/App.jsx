import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import ChatPage from './ChatPage';
import ErrorPage from './ErrorPage';
import LoginPage from './LoginPage';
import Navbar from './Navbar';
import SignupPage from './SignupPage';

import { AuthContext } from '../contexts';
import routes from '../routes';
import { useAuth } from '../hooks';

const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [username, setUsername] = useState(userData?.username ?? null);

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return user ? { Authorization: `Bearer ${user.token}` } : {};
  };

  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUsername(user.username);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUsername(null);
  };

  const values = useMemo(() => ({
    getAuthHeader,
    login,
    logout,
    username,
  }), [username]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const PrivateOutlet = () => {
  const { username } = useAuth();

  return username ? <Outlet /> : <Navigate to={routes.loginPagePath()} />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Routes>
          <Route path={routes.loginPagePath()} element={<LoginPage />} />
          <Route path={routes.signupPagePath()} element={<SignupPage />} />
          <Route path={routes.chatPagePath()} element={<PrivateOutlet />}>
            <Route path="" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
