import { useDispatch, useSelector } from 'react-redux';
import { Modal as BootstrapModal } from 'react-bootstrap';

import AddChannel from './AddChannel';
import RemoveChannel from './RemoveChannel';
import RenameChannel from './RenameChannel';

import { actions } from '../../slices';

const mapping = {
  addChannel: AddChannel,
  removeChannel: RemoveChannel,
  renameChannel: RenameChannel,
};

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modal);

  const handleClose = () => {
    dispatch(actions.closeModal());
  };

  const Component = mapping[type];

  return (
    <BootstrapModal show={isOpened} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
