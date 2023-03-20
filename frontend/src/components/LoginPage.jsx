import axios from 'axios';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Image, Container, Row, Col } from 'react-bootstrap';

import routes from '../routes';
import { useAuth } from '../hooks';

import loginImage from '../assets/login.jpeg';

const LoginPage = () => {
  const input = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isInvalid, setIsInvalid] = useState(false);

  const validationSchema = object({
    username: string().trim().required(),
    password: string().trim().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsInvalid(false);

      try {
        const { data } = await axios.post(routes.loginPath(), values);

        login(data);
        navigate(routes.chatPagePath());
      } catch (error) {
        input.current.select();

        setIsInvalid(true);
      }
    },
  });

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <Container className='h-100' fluid>
      <Row className='justify-content-center align-content-center h-100'>
        <Col xs='12' md='8' xxl='6'>
          <Card className='shadow-sm'>
            <Card.Body className='row p-5'>
              <Col className='d-flex align-items-center justify-content-center' xs='12' md='6'>
                <Image src={loginImage} alt='Login' roundedCircle />
              </Col>
              <Form className='col-12 col-md-6 mt-3 mt-mb-0' onSubmit={formik.handleSubmit}>
                <h1 className='text-center mb-4'>Login</h1>
                <Form.FloatingLabel className='mb-3' label='Username'>
                  <Form.Control
                    name='username'
                    autocomplete='username'
                    placeholder='Username'
                    value={formik.values.username}
                    isInvalid={isInvalid}
                    onChange={formik.handleChange}
                    ref={input}
                    required
                  />
                </Form.FloatingLabel>
                <Form.FloatingLabel className='mb-3' label='Password'>
                  <Form.Control
                    name='password'
                    autocomplete='current-password'
                    placeholder='Password'
                    type='password'
                    value={formik.values.password}
                    isInvalid={isInvalid}
                    onChange={formik.handleChange}
                    required
                  />
                  {isInvalid && <Form.Control.Feedback type="invalid" tooltip>Incorrect username or password</Form.Control.Feedback>}
                </Form.FloatingLabel>
                <Button className='w-100 mb-3' variant='outline-primary' type='submit'>Submit</Button>
              </Form>
            </Card.Body>
            <Card.Footer className='p-4'>
              <div className='text-center'>
                <span>No account?</span> <a href='/signup'>Registration</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;