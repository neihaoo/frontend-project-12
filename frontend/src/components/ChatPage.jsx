import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { string, object } from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightSquare, PlusSquare } from 'react-bootstrap-icons';
import { Button, Col, Container, InputGroup, Form, Nav, Row } from 'react-bootstrap';

import routes from '../routes';
import { useApi, useAuth } from '../hooks';
import { actions as channelsActions } from '../slices/channelsSlice';

const Channel = ({ channel, isCurrent }) => {
  const variant = isCurrent ? 'secondary' : null;

  return (
    <Nav.Item key={channel.id} as='li'>
      <Button
        key={channel.id}
        className='w-100 rounded-0 text-start'
        variant={variant}
        type='button'
      >
        <span className='me-1'>#</span>
        {channel.name}
      </Button>
    </Nav.Item>
  );
};

const Message = ({ username, body }) => (
  <div className="text-break mb-2">
    <b>{username}</b>
    {`: ${body}`}
  </div>
);

const ChatPage = () => {
  const input = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendMessage } = useApi();
  const { username, getAuthHeader } = useAuth();
  const { messages } = useSelector((state) => state.messages);
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const currentChannel = channels.find(({ id }) => id === currentChannelId);
  const currentChannelMessages = messages.filter(({ channelId }) => channelId === currentChannelId);

  const validationSchema = object({
    body: string().trim().required(),
  });

  const {
    dirty,
    values,
    isValid,
    resetForm,
    isSubmitting,
    handleChange,
    handleSubmit,
    setSubmitting,
  } = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }) => {
      const message = {
        channelId: currentChannel.id,
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

  const isInvalid = !dirty || !isValid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });

        dispatch(channelsActions.setInitialState(data));
      } catch (error) {
        navigate(routes.loginPagePath());
      }
    };

    input.current.focus();

    fetchData();
  }, [dispatch, getAuthHeader, navigate]);

  return (
    <Container className='h-100 my-4 overflow-hidden rounded shadow'>
      <Row className='h-100 bg-white flex-md-row'>
        <Col className='border-end px-0 bg-light flex-column h-100 d-flex' xs='4' md='2'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>Channels</b>
            <Button
              className='p-0 text-primary'
              variant='group-vertical'
              type='button'
            >
              <PlusSquare size={20} />
              <span className='visually-hidden'>+</span>
            </Button>
          </div>
          <Nav
            id='channels-box'
            className='flex-column px-2 mb-3 overflow-auto h-100 d-block'
            as={'ul'}
            variant='pills'
            fill
          >
            {channels.map((channel) => (
              <Channel
                key={channel.id}
                channel={channel}
                isCurrent={channel.id === currentChannelId}
              />
            ))}
          </Nav>
        </Col>
        <Col className='p-0 h-100'>
          <div className='d-flex flex-column h-100'>
            <div className='bg-light mb-4 p-3 shadow-sm small'>
              <p className='m-0'>
                <b># {currentChannel?.name}</b>
              </p>
              <span className='text-muted'>
                {`${currentChannelMessages.length} messages`}
              </span>
            </div>
            <div id='messages-box' className='chat-messages overflow-auto px-5'>
              {currentChannelMessages.map(({ id, username, body }) => (
                <Message key={id} username={username} body={body} />
              ))}
            </div>
            <div className='mt-auto px-5 py-3'>
              <Form className='py-1 border rounded-2' noValidate onSubmit={handleSubmit}>
                <InputGroup hasValidation={isInvalid}>
                  <Form.Control
                    name='body'
                    aria-label='New message'
                    placeholder='Enter a message...'
                    className='border-0 p-0 ps-2'
                    ref={input}
                    value={values.body}
                    disabled={isSubmitting}
                    onChange={handleChange}
                  />
                  <Button className='border-0' variant='group-vertical' type='submit' disabled={isInvalid}>
                    <ArrowRightSquare size={20} />
                    <span className='visually-hidden'>Send</span>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>          
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;