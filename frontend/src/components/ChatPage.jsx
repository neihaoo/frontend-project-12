import axios from 'axios';
import { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';

import Chat from './Chat';
import Modal from './Modal';
import Channels from './Channels';

import routes from '../routes';
import { useAuth } from '../hooks';
import { actions } from '../slices/channels';

const normalizeData = (data) => ({
  entities: data.reduce((acc, item) => {
    acc[item.id] = item;

    return acc;
  }, {}),
  ids: data.map(({ id }) => id),
});

const ChatPage = () => {
  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });

        const channels = normalizeData(data.channels);
        const messages = normalizeData(data.messages);
        const currentChannelId = data.currentChannelId;

        dispatch(actions.setInitialState({ channels, messages, currentChannelId }));
      } catch (error) {
        console.log({ error });
      }
    };

    fetchData();
  }, [dispatch, getAuthHeader]);

  return (
    <>
      <Container className='h-100 my-4 overflow-hidden rounded shadow'>
        <Row className='h-100 bg-white flex-md-row'>
          <Col className='border-end px-0 bg-light flex-column h-100 d-flex' xs='4' md='2'>
            <Channels />
          </Col>
          <Col className='p-0 h-100'>
            <Chat />
          </Col>
        </Row>
      </Container>
      <Modal />
    </>
  );
};

export default ChatPage;