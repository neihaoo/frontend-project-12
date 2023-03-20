import axios from 'axios';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Image, Container, Row, Col } from 'react-bootstrap';

import routes from '../routes';
import { useAuth } from '../hooks';

import singupImage from '../assets/signup.jpg'

const SignupPage = () => {
  const input = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [singupFailed, setSingupFailed] = useState(false);

  const validationSchema = object({
    username: string().trim().required().min(3).max(20),
    password: string().trim().required().min(6),
    confirmPassword: string().test((value, context) => value === context.parent.password),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async ({ username, password }) => {
      setSingupFailed(false);

      try {
        const { data } = await axios.post(routes.signupPath(), { username, password });

        login(data);
        navigate(routes.chatPagePath());
      } catch (error) {
        if (error.response.status === 409) {
          input.current.select();

          setSingupFailed(true);

          return;
        }

        throw error;
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
                <Image src={singupImage} alt='Singup' roundedCircle />
              </Col>
              <Form className='col-12 col-md-6 mt-3 mt-mb-0' onSubmit={formik.handleSubmit}>
                <h1 className='text-center mb-4'>Singup</h1>
                <Form.FloatingLabel className='mb-3' label='Username'>
                  <Form.Control
                    name='username'
                    autocomplete='username'
                    placeholder='Username'
                    value={formik.values.username}
                    isInvalid={(formik.errors.username && formik.touched.username) || singupFailed}
                    onChange={formik.handleChange}
                    ref={input}
                    required
                  />
                  <Form.Control.Feedback type='invalid' tooltip>{formik.errors.username}</Form.Control.Feedback>
                </Form.FloatingLabel>
                <Form.FloatingLabel className='mb-3' label='Password'>
                  <Form.Control
                    type='password'
                    name='password'
                    autocomplete='new-password'
                    placeholder='Password'
                    value={formik.values.password}
                    isInvalid={(formik.errors.password && formik.touched.password) || singupFailed}
                    onChange={formik.handleChange}
                    required
                  />
                  <Form.Control.Feedback type='invalid' tooltip>{formik.errors.password}</Form.Control.Feedback>
                </Form.FloatingLabel>
                <Form.FloatingLabel className='mb-3' label='Confirm password'>
                  <Form.Control
                    type='password'
                    name='confirmPassword'
                    autocomplete='new-password'
                    placeholder='Confirm password'
                    value={formik.values.confirmPassword}
                    isInvalid={(formik.errors.confirmPassword && formik.touched.confirmPassword) || singupFailed}
                    onChange={formik.handleChange}
                    required
                  />
                  <Form.Control.Feedback type='invalid' tooltip>
                    {singupFailed ? 'Username already taken' : formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.FloatingLabel>
                <Button className='w-100 mb-3' variant='outline-primary' type='submit'>Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
