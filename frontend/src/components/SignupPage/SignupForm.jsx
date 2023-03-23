import { Button, Form } from 'react-bootstrap';
import { object, string } from 'yup';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import routes from '../../routes';
import { useAuth } from '../../hooks';

const SignupForm = () => {
  const input = useRef();
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signupFailed, setSignupFailed] = useState(false);

  const validationSchema = object({
    username: string()
      .trim()
      .required()
      .min(3)
      .max(20),
    password: string()
      .trim()
      .required()
      .min(6),
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
    onSubmit: async ({ password, username }) => {
      setSignupFailed(false);

      try {
        const { data } = await axios.post(routes.signupPath(), {
          password,
          username,
        });

        login(data);
        navigate(routes.chatPagePath());
      } catch (error) {
        if (error.response.status === 409) {
          setSignupFailed(true);
        } else if (error.isAxiosError) {
          toast.error(t('errors.network'));
        } else {
          toast.error(t('errors.unknown'));
        }

        input.current.select();
        throw error;
      }
    },
  });

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <Form
      className="col-12 col-md-6 mt-3 mt-mb-0"
      onSubmit={formik.handleSubmit}
    >
      <h1 className="text-center mb-4">{t('signup.title')}</h1>
      <Form.FloatingLabel
        className="mb-3"
        controlId="username"
        label={t('signup.username')}
      >
        <Form.Control
          name="username"
          autocomplete="username"
          placeholder={t('signup.username')}
          value={formik.values.username}
          isInvalid={
            (formik.errors.username && formik.touched.username)
            || signupFailed
          }
          onChange={formik.handleChange}
          ref={input}
          required
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {t(formik.errors.username)}
        </Form.Control.Feedback>
      </Form.FloatingLabel>
      <Form.FloatingLabel
        className="mb-3"
        controlId="password"
        label={t('signup.password')}
      >
        <Form.Control
          type="password"
          name="password"
          autocomplete="new-password"
          placeholder={t('signup.password')}
          value={formik.values.password}
          isInvalid={
            (formik.errors.password && formik.touched.password)
            || signupFailed
          }
          onChange={formik.handleChange}
          required
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {t(formik.errors.password)}
        </Form.Control.Feedback>
      </Form.FloatingLabel>
      <Form.FloatingLabel
        className="mb-3"
        controlId="confirmPassword"
        label={t('signup.confirm')}
      >
        <Form.Control
          type="password"
          name="confirmPassword"
          autocomplete="new-password"
          placeholder={t('signup.confirm')}
          value={formik.values.confirmPassword}
          isInvalid={
            (formik.errors.confirmPassword
              && formik.touched.confirmPassword)
            || signupFailed
          }
          onChange={formik.handleChange}
          required
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {signupFailed
            ? t('signup.exists')
            : t(formik.errors.confirmPassword)}
        </Form.Control.Feedback>
      </Form.FloatingLabel>
      <Button
        className="w-100 mb-3"
        variant="outline-primary"
        type="submit"
      >
        {t('signup.submit')}
      </Button>
    </Form>
  );
};

export default SignupForm;
