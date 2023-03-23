import {
  Card,
  Col,
  Container,
  Image,
  Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import SignupForm from './SignupForm';

import singupImage from '../../media/signup.jpg';

const SignupPage = () => {
  const { t } = useTranslation();

  return (
    <Container className="h-100" fluid>
      <Row className="justify-content-center align-content-center h-100">
        <Col xs="12" md="8" xxl="6">
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col
                className="d-flex align-items-center justify-content-center"
                xs="12"
                md="6"
              >
                <Image
                  src={singupImage}
                  alt={t('signup.title')}
                  roundedCircle
                />
              </Col>
              <SignupForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
