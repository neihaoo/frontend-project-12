import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { Button, InputGroup, Form } from 'react-bootstrap';

import { useApi, useAuth } from '../hooks';
import { selectCurrentChannel, selectCurrentChannelMessages } from '../selectors';

const Message = ({ username, body }) => (
  <div className="text-break mb-2">
    <b>{username}</b>
    {`: ${body}`}
  </div>
);

const Chat = () => {
  const input = useRef();
  const { username } = useAuth();
  const { sendMessage } = useApi();
  const channel = useSelector(selectCurrentChannel);
  const messages = useSelector(selectCurrentChannelMessages);

  const validationSchema = object({
    body: string().trim().required(),
  });

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }, { resetForm, setSubmitting }) => {
      const message = {
        channelId: channel.id,
        body,
        username,
      };

      try {
        await sendMessage(message);

        resetForm();
      } catch (error) {
        console.log(error);
      }

      setSubmitting(false);
    },
  });

  const isInvalid = !formik.dirty || !formik.isValid;

  useEffect(() => {
    input.current.focus();
  }, [])

  return (
    <div className='d-flex flex-column h-100'>
      <div className='bg-light mb-4 p-3 shadow-sm small'>
        <p className='m-0'>
          <b># {channel?.name}</b>
        </p>
        <span className='text-muted'>
          {`${messages.length} messages`}
        </span>
      </div>
      <div id='messages-box' className='chat-messages overflow-auto px-5'>
        {messages.map(({ id, username, body }) => (
          <Message key={id} username={username} body={body} />
        ))}
      </div>
      <div className='mt-auto px-5 py-3'>
        <Form className='py-1 border rounded-2' noValidate onSubmit={formik.handleSubmit}>
          <InputGroup hasValidation={isInvalid}>
            <Form.Control
              ref={input}
              name='body'
              aria-label='New message'
              value={formik.values.body}
              className='border-0 p-0 ps-2'
              disabled={formik.isSubmitting}
              onChange={formik.handleChange}
              placeholder='Enter a message...'
            />
            <Button className='border-0' variant='group-vertical' type='submit' disabled={isInvalid}>
              <ArrowRightSquare size={20} />
              <span className='visually-hidden'>Send</span>
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>   
  );
};

export default Chat;