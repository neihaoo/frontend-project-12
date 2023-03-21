import { useFormik } from 'formik';
import { object, string } from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        toast.success(t('channels.created'));
        handleClose();
      } catch (error) {
        if (error.name === 'ValidationError') {
          formik.values.name = name;

          setStatus(error.message);
        } else if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
        } else {
          toast.error(t('errors.network'));
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
        <BootstrapModal.Title>{t('modals.add')}</BootstrapModal.Title>
        <Button
          variant='close'
          type='button'
          onClick={handleClose}
          aria-label={t('modals.close')}
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
            <Form.Label visuallyHidden>{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type='invalid'>
              {t(formik.errors.name) || t(formik.status)}
            </Form.Control.Feedback>
            <div className='d-flex justify-content-end'>
              <Button
                className='me-2'
                variant='secondary'
                type='button'
                onClick={handleClose}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant='primary'
                type='submit'
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const RemoveChannelForm = ({ handleClose }) => {
  const { t } = useTranslation();
  const { removeChannel } = useApi();
  const [loading, setLoading] = useState(false);
  const { channelId } = useSelector((state) => state.modal.extra);

  const handleRemove = async () => {
    setLoading(true);

    try {
      await removeChannel({ id: channelId });

      toast.success(t('channels.removed'));
      handleClose();
    } catch (error) {
      if (!error.isAxiosError) {
        toast.error(t('errors.unknown'));
      } else {
        toast.error(t('errors.network'));
      }

      setLoading(false);
    }
  };

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>{t('modals.remove')}</BootstrapModal.Title>
        <Button
          variant='close'
          type='button'
          onClick={handleClose}
          aria-label={t('modals.close')}
          data-bs-dismiss='modal'
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p className='lead'>{t('modals.confirmation')}</p>
        <div className='d-flex justify-content-end'>
          <Button
            className='me-2'
            variant='secondary'
            type='button'
            onClick={handleClose}
            disabled={loading}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            variant='danger'
            type='button'
            onClick={handleRemove}
            disabled={loading}
          >
            {t('modals.confirm')}
          </Button>
        </div>
      </BootstrapModal.Body>
    </>
  );
};

const RenameChannelForm = ({ handleClose }) => {
  const input = useRef();
  const { t } = useTranslation();
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

        toast.success(t('channels.renamed'));
        handleClose();
      } catch (error) {
        if (error.name === 'ValidationError') {
          formik.values.name = name;

          setStatus(error.message);
        } else if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
        } else {
          toast.error(t('errors.network'));
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
        <BootstrapModal.Title>{t('modals.rename')}</BootstrapModal.Title>
        <Button
          variant='close'
          type='button'
          onClick={handleClose}
          aria-label={t('modals.close')}
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
            <Form.Label visuallyHidden>{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type='invalid'>
              {t(formik.errors.name) || t(formik.status)}
            </Form.Control.Feedback>
            <div className='d-flex justify-content-end'>
              <Button
                className='me-2'
                variant='secondary'
                type='button'
                onClick={handleClose}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant='primary'
                type='submit'
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
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