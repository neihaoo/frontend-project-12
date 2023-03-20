import { PlusSquare } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Dropdown, Nav } from 'react-bootstrap';

import { actions as modalActions } from '../slices/modal';
import { actions as channelsActions, selectors } from '../slices/channels';

const Channel = ({ channel, isCurrent, handleChooseChannel, handleRemoveChannel, handleRenameChannel }) => {
  const variant = isCurrent ? 'secondary' : null;

  return (
    <Nav.Item key={channel.id} as='li'>
      {
        channel.removable ? (
          <Dropdown className='d-flex' as={ButtonGroup}>
            <Button
              key={channel.id}
              className='w-100 rounded-0 text-start text-truncate'
              type='button'
              onClick={handleChooseChannel}
              variant={variant}
            >
              <span className='me-1'>#</span>
              {channel.name}
            </Button>
            <Dropdown.Toggle className='flex-grow-0' variant={variant} split>
              <span className='visually-hidden'>Channel control</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRemoveChannel}>Remove</Dropdown.Item>
              <Dropdown.Item onClick={handleRenameChannel}>Rename</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button
            key={channel.id}
            className='w-100 rounded-0 text-start'
            variant={variant}
            type='button'
            onClick={handleChooseChannel}
          >
            <span className='me-1'>#</span>
            {channel.name}
          </Button>
        )
      }
    </Nav.Item>
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const { currentChannelId } = useSelector((state) => state.channels);

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

  return (
    <>
      <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
        <b>Channels</b>
        <Button
          className='p-0 text-primary'
          variant='group-vertical'
          type='button'
          onClick={handleAddChannel}
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