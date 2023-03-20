import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal as BootstrapModal } from 'react-bootstrap';

import { useApi } from '../hooks';
import { selectChannelsNames } from '../selectors';
import { actions as modalActions } from '../slices/modal';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channels';

const getValidationSchema = (channels) => object({
  name: string().trim().required().min(3).max(20).notOneOf(channels),
});

const AddChannelForm = ({ handleClose }) => {
  const input = useRef();
  const dispatch = useDispatch();
  const { addChannel } = useApi();
  const channels = useSelector(selectChannelsNames);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getValidationSchema(channels),
    validateOnChange: false,
    onSubmit: async ({ name }, { setSubmitting, setStatus }) => {
      try {
        const { id } = await addChannel({ name });

        dispatch(channelsActions.setCurrentChannel({ channelId: id }));
        handleClose();
      } catch (error) {
        if (error.name === 'ValidationError') {
          formik.values.name = name;

          setStatus(error.message);
        }

        input.current.select();
        
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Add channel</BootstrapModal.Title>
        <Button
          variant='close'
          type='button'
          onClick={handleClose}
          aria-label='Close'
          data-bs-dismiss='modal'
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Control
              className='mb-2'
              disabled={formik.isSubmitting}
              ref={input}
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={(formik.errors.name && formik.touched.name) || !!formik.status}
            />
            <Form.Label visuallyHidden>Chanel name</Form.Label>
            <Form.Control.Feedback type='invalid'>
              {formik.errors.name || formik.status}
            </Form.Control.Feedback>
            <div className='d-flex justify-content-end'>
              <Button
                className='me-2'
                variant='secondary'
                type='button'
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                type='submit'
                disabled={formik.isSubmitting}
              >
                Submit
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const RemoveChannelForm = ({ handleClose }) => {
  const { removeChannel } = useApi();
  const [loading, setLoading] = useState(false);
  const { channelId } = useSelector((state) => state.modal.extra);

  const handleRemove = async () => {
    setLoading(true);

    try {
      await removeChannel({ id: channelId });

      handleClose();
    } catch (erroe) {
      setLoading(false);
    }
  };

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Remove channel</BootstrapModal.Title>
        <Button
          variant='close'
          type='button'
          onClick={handleClose}
          aria-label='Close'
          data-bs-dismiss='modal'
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p className='lead'>Are you sure?</p>
        <div className='d-flex justify-content-end'>
          <Button
            className='me-2'
            variant='secondary'
            type='button'
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant='danger'
            type='button'
            onClick={handleRemove}
            disabled={loading}
          >
            Confirm
          </Button>
        </div>
      </BootstrapModal.Body>
    </>
  );
};

const RenameChannelForm = ({ handleClose }) => {
  const input = useRef();
  const { renameChannel } = useApi();
  const channels = useSelector(selectChannelsNames);
  const { channelId } = useSelector((state) => state.modal.extra);
  const channel = useSelector((state) => channelsSelectors.selectById(state, channelId));

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: getValidationSchema(channels),
    validateOnChange: false,
    onSubmit: async ({ name }, { setSubmitting, setStatus }) => {
      try {
        await renameChannel({ name, id: channelId });

        handleClose();
      } catch (error) {
        if (error.name === 'ValidationError') {
          formik.values.name = name;

          setStatus(error.message);
        } else if (!error.isAxiosError) {
          throw error;
        }

        input.current.select();

        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    setTimeout(() => input.current.select());
  }, []);

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Rename channel</BootstrapModal.Title>
        <Button
          variant='close'
          type='button'
          onClick={handleClose}
          aria-label='Close'
          data-bs-dismiss='modal'
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Control
              className='mb-2'
              disabled={formik.isSubmitting}
              ref={input}
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={(formik.errors.name && formik.touched.name) || !!formik.status}
            />
            <Form.Label visuallyHidden>Chanel name</Form.Label>
            <Form.Control.Feedback type='invalid'>
              {formik.errors.name || formik.status}
            </Form.Control.Feedback>
            <div className='d-flex justify-content-end'>
              <Button
                className='me-2'
                variant='secondary'
                type='button'
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                type='submit'
                disabled={formik.isSubmitting}
              >
                Submit
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const mapping = {
  addChannel: AddChannelForm,
  removeChannel: RemoveChannelForm,
  renameChannel: RenameChannelForm,
};

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modal);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const Component = mapping[type];

  return (
    <BootstrapModal show={isOpened} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
