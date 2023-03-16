import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRightSquare, PlusSquare } from 'react-bootstrap-icons';
import { Button, Container, Form, InputGroup, Nav, Row, Col } from 'react-bootstrap';

import routes from '../routes';
import { useAuth } from '../hooks';
import { actions as channelsActions } from '../slices/channelsSlice';

const Channel = ({ channel }) => {
  return (
    <Nav.Item key={channel.id} as='li'>
      <Button
        key={channel.id}
        className='w-100 rounded-0 text-start'
        variant=''
        type='button'
      >
        <span className='me-1'>#</span>
        {channel.name}
      </Button>
    </Nav.Item>
  );
};

const ChatPage = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);
  const currentChannel = channels.find(({ id }) => id === currentChannelId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: auth.getAuthHeader() });

        dispatch(channelsActions.setInitialState(data));
      } catch (error) {
        navigate(routes.loginPagePath());
      }
    };

    fetchData();
  }, [dispatch, auth, navigate]);

  return (
    <Container className='h-100 my-4 overflow-hidden rounded shadow'>
      <Row className='h-100 bg-white flex-md-row'>
        <Col className='border-end px-0 bg-light flex-column h-100 d-flex' xs='4' md='2'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>Channels</b>
            <Button className='p-0 text-primary' variant='group-vertical' type='button'>
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
            {channels.map((channel) => <Channel key={channel.id} channel={channel} />)}
          </Nav>
        </Col>
        <Col className='p-0 h-100'>
          <div className='d-flex flex-column h-100'>
            <div className='bg-light mb-4 p-3 shadow-sm small'>
              <p className='m-0'>
                <b># {currentChannel?.name}</b>
              </p>
              <span className='text-muted'>0 messages</span>
            </div>
            <div id='messages-box' className='chat-messages overflow-auto px-5'></div>
            <div className='mt-auto px-5 py-3'>
              <Form className='py-1 border rounded-2' noValidate>
                <InputGroup hasValidation>
                  <Form.Control
                    name='body'
                    aria-label='New message'
                    placeholder='Enter a message...'
                    className='border-0 p-0 ps-2'
                    value=''
                  />
                  <Button variant='group-vertical' type='submit' disabled>
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