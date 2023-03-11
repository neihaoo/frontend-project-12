import axios from 'axios';
import { Formik } from 'formik';
import { useContext, useState } from 'react';
import { string, object } from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

import AuthContext from '../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isInvalid, setIsInvalid] = useState(false);

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={object({
        username: string().required(),
        password: string().required(),
      })}
      onSubmit={async (values) => {
        try {
          const { data } = await axios.post('/api/v1/login', values);
          login(data);
          navigate('/');
        } catch(error) {
          setIsInvalid(true);
        }
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form className='col-12 col-md-6 mt-3 mt-mb-0' onSubmit={handleSubmit}>
          <h1 className='text-center mb-4'>Login</h1>
          <Form.FloatingLabel className='mb-3' label='Username'>
            <Form.Control
              name='username'
              autocomplete='username'
              placeholder='Username'
              value={values.username}
              isInvalid={isInvalid}
              onChange={handleChange}
              required
            />
          </Form.FloatingLabel>
          <Form.FloatingLabel className='mb-4' label='Password'>
            <Form.Control
              name='password'
              autocomplete='current-password'
              placeholder='Password'
              type='password'
              value={values.password}
              isInvalid={isInvalid}
              onChange={handleChange}
              required
            />
            {isInvalid && <Form.Control.Feedback type="invalid" tooltip>Неверные имя пользователя или пароль</Form.Control.Feedback>}
          </Form.FloatingLabel>
          <Button className='w-100 mb-3' variant='outline-primary' type='submit'>Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;