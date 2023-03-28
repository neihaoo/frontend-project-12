import {
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Channels from './Channels';
import Chat from './Chat';
import Modal from '../Modal';

import { actions } from '../../slices';
import routes from '../../routes';
import { useAuth } from '../../hooks';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), {
          headers: getAuthHeader(),
        });

        dispatch(actions.setInitialState(data));
      } catch (error) {
        if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
        } else {
          toast.error(t('errors.network'));
        }

        throw error;
      }

      setLoading(false);
    };

    fetchData();
  }, [dispatch, getAuthHeader, t]);

  return loading ? (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">{t('loading')}</span>
      </Spinner>
    </div>
  ) : (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col
            className="border-end px-0 bg-light flex-column h-100 d-flex"
            xs="4"
            md="2"
          >
            <Channels />
          </Col>
          <Col className="p-0 h-100">
            <Chat />
          </Col>
        </Row>
      </Container>
      <Modal />
    </>
  );
};

export default ChatPage;
