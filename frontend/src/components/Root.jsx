import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

import AuthContext from '../context/AuthContext';

const Root = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className='shadow-sm' expand='lg' bg='white'>
        <Container>
          <Navbar.Brand href='/'>Hexlet Chat</Navbar.Brand>
          {isAuthenticated && <Button variant='primary' type='button' onClick={logout}>Logout</Button>}
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default Root;