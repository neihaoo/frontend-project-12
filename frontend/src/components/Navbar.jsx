import { Button, Container, Navbar as BootstrapNavbar } from 'react-bootstrap';

import routes from '../routes';
import { useAuth } from '../hooks';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <BootstrapNavbar className='shadow-sm' bg='white' expand='lg'>
      <Container>
        <BootstrapNavbar.Brand href={routes.chatPagePath()}>Hexlet Chat</BootstrapNavbar.Brand>
        {!!isAuthenticated && <Button variant='primary' type='button' onClick={logout}>Logout</Button>}
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
