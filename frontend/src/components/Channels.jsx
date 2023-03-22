import { useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import { useTranslation } from 'react-i18next';
import { PlusSquare } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Dropdown,
  Nav,
} from 'react-bootstrap';

import { actions as modalActions } from '../slices/modal';
import { defaultChannelId, actions as channelsActions, selectors } from '../slices/channels';

const Channel = ({
  channel,
  isCurrent,
  handleChooseChannel,
  handleRemoveChannel,
  handleRenameChannel,
}) => {
  const { t } = useTranslation();

  const variant = isCurrent ? 'secondary' : null;

  return (
    <Nav.Item key={channel.id} as="li">
      {
        channel.removable ? (
          <Dropdown className="d-flex" as={ButtonGroup}>
            <Button
              key={channel.id}
              className="w-100 rounded-0 text-start text-truncate"
              type="button"
              onClick={handleChooseChannel}
              variant={variant}
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>
            <Dropdown.Toggle className="flex-grow-0" variant={variant} split>
              <span className="visually-hidden">{t('channels.menu')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRemoveChannel}>{t('channels.remove')}</Dropdown.Item>
              <Dropdown.Item onClick={handleRenameChannel}>{t('channels.rename')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button
            key={channel.id}
            className="w-100 rounded-0 text-start"
            variant={variant}
            type="button"
            onClick={handleChooseChannel}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        )
      }
    </Nav.Item>
  );
};

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const { currentChannelId } = useSelector((state) => state.channels);
  const lastChannelId = channels.at(-1)?.id;

  const handleChooseChannel = (channelId) => () => {
    dispatch(channelsActions.setCurrentChannel({ channelId }));
  };

  const handleAddChannel = () => {
    dispatch(modalActions.openModal({ type: 'addChannel' }));
  };

  const handleRemoveChannel = (channelId) => () => {
    dispatch(modalActions.openModal({ type: 'removeChannel', extra: { channelId } }));
  };

  const handleRenameChannel = (channelId) => () => {
    dispatch(modalActions.openModal({ type: 'renameChannel', extra: { channelId } }));
  };

  useEffect(() => {
    if (currentChannelId === defaultChannelId) {
      animateScroll.scrollToTop({ containerId: 'channels-box', delay: 0, duration: 0 });
    }
    if (currentChannelId === lastChannelId) {
      animateScroll.scrollToBottom({ containerId: 'channels-box', delay: 0, duration: 0 });
    }
  }, [currentChannelId, lastChannelId]);

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.title')}</b>
        <Button
          className="p-0 text-primary"
          variant="group-vertical"
          type="button"
          onClick={handleAddChannel}
        >
          <PlusSquare size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <Nav
        id="channels-box"
        className="flex-column px-2 mb-3 overflow-auto h-100 d-block"
        as="ul"
        variant="pills"
        fill
      >
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            isCurrent={channel.id === currentChannelId}
            handleChooseChannel={handleChooseChannel(channel.id)}
            handleRemoveChannel={handleRemoveChannel(channel.id)}
            handleRenameChannel={handleRenameChannel(channel.id)}
          />
        ))}
      </Nav>
    </>
  );
};

export default Channels;
