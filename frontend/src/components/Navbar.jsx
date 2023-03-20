import { Link } from 'react-router-dom';
import { Button, Container, Navbar as BootstrapNavbar } from 'react-bootstrap';

import routes from '../routes';
import { useAuth } from '../hooks';

const Navbar = () => {
  const { logout, username } = useAuth();

  return (
    <BootstrapNavbar className='shadow-sm' bg='white' expand='lg'>
      <Container>
        <BootstrapNavbar.Brand as={Link} to={routes.chatPagePath()}>Hexlet Chat</BootstrapNavbar.Brand>
        {!!username && <Button variant='primary' type='button' onClick={logout}>Logout</Button>}
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
