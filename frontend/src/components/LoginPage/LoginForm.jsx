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

const LoginForm = () => {
  const input = useRef();
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isInvalid, setIsInvalid] = useState(false);

  const validationSchema = object({
    password: string().trim().required(),
    username: string().trim().required(),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      username: '',
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
        if (error.response.status === 401) {
          setIsInvalid(true);
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
      <h1 className="text-center mb-4">{t('login.title')}</h1>
      <Form.FloatingLabel
        className="mb-3"
        controlId="username"
        label={t('login.username')}
      >
        <Form.Control
          name="username"
          autocomplete="username"
          placeholder={t('login.username')}
          value={formik.values.username}
          isInvalid={isInvalid}
          onChange={formik.handleChange}
          ref={input}
          required
        />
      </Form.FloatingLabel>
      <Form.FloatingLabel
        className="mb-3"
        controlId="password"
        label={t('login.password')}
      >
        <Form.Control
          name="password"
          autocomplete="current-password"
          placeholder={t('login.password')}
          type="password"
          value={formik.values.password}
          isInvalid={isInvalid}
          onChange={formik.handleChange}
          required
        />
        {isInvalid && (
          <Form.Control.Feedback type="invalid" tooltip>
            {t('login.auth')}
          </Form.Control.Feedback>
        )}
      </Form.FloatingLabel>
      <Button
        className="w-100 mb-3"
        variant="outline-primary"
        type="submit"
      >
        {t('login.submit')}
      </Button>
    </Form>
  );
};

export default LoginForm;
