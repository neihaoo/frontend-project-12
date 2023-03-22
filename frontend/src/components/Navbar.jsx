import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Container, Navbar as BootstrapNavbar } from 'react-bootstrap';

import routes from '../routes';
import { useAuth } from '../hooks';

const Navbar = () => {
  const { t } = useTranslation();
  const { logout, username } = useAuth();

  return (
    <BootstrapNavbar className="shadow-sm" bg="white" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to={routes.chatPagePath()}>{t('title')}</BootstrapNavbar.Brand>
        {!!username && <Button variant="primary" type="button" onClick={logout}>{t('logout')}</Button>}
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
