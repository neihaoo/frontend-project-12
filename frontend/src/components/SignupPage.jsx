import axios from 'axios';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Image, Container, Row, Col } from 'react-bootstrap';

import routes from '../routes';
import { useAuth } from '../hooks';

import singupImage from '../media/signup.jpg'

const SignupPage = () => {
  const input = useRef();
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [singupFailed, setSingupFailed] = useState(false);

  const validationSchema = object({
    username: string().trim().required().min(3).max(20),
    password: string().trim().required().min(6),
    confirmPassword: string().test(
      'confirmPassword',
      'signup.match',
      (value, context) => value === context.parent.password,
    ),
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
          setSingupFailed(true);
        } else if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
        } else {
          toast.error(t('errors.network'));
        }

        input.current.select();
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
                <Image src={singupImage} alt={t('signup.title')} roundedCircle />
              </Col>
              <Form className='col-12 col-md-6 mt-3 mt-mb-0' onSubmit={formik.handleSubmit}>
                <h1 className='text-center mb-4'>{t('signup.title')}</h1>
                <Form.FloatingLabel className='mb-3' label={t('signup.username')}>
                  <Form.Control
                    name='username'
                    autocomplete='username'
                    placeholder={t('signup.username')}
                    value={formik.values.username}
                    isInvalid={(formik.errors.username && formik.touched.username) || singupFailed}
                    onChange={formik.handleChange}
                    ref={input}
                    required
                  />
                  <Form.Control.Feedback type='invalid' tooltip>
                    {t(formik.errors.username?.key, formik.errors.username?.values)}
                    </Form.Control.Feedback>
                </Form.FloatingLabel>
                <Form.FloatingLabel className='mb-3' label={t('signup.password')}>
                  <Form.Control
                    type='password'
                    name='password'
                    autocomplete='new-password'
                    placeholder={t('signup.password')}
                    value={formik.values.password}
                    isInvalid={(formik.errors.password && formik.touched.password) || singupFailed}
                    onChange={formik.handleChange}
                    required
                  />
                  <Form.Control.Feedback type='invalid' tooltip>
                    {t(formik.errors.password?.key, formik.errors.password?.values)}
                  </Form.Control.Feedback>
                </Form.FloatingLabel>
                <Form.FloatingLabel className='mb-3' label={t('signup.confirm')}>
                  <Form.Control
                    type='password'
                    name='confirmPassword'
                    autocomplete='new-password'
                    placeholder={t('signup.confirm')}
                    value={formik.values.confirmPassword}
                    isInvalid={(formik.errors.confirmPassword && formik.touched.confirmPassword) || singupFailed}
                    onChange={formik.handleChange}
                    required
                  />
                  <Form.Control.Feedback type='invalid' tooltip>
                    {singupFailed ? t('signup.exists') : t(formik.errors.confirmPassword)}
                  </Form.Control.Feedback>
                </Form.FloatingLabel>
                <Button className='w-100 mb-3' variant='outline-primary' type='submit'>{t('signup.submit')}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;