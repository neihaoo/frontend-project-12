import { Button, Form, Modal } from 'react-bootstrap';
import { object, string } from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { actions } from '../../slices';
import { selectChannelsNames } from '../../selectors';
import { useApi } from '../../hooks';

const AddChannel = ({ handleClose }) => {
  const input = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { addChannel } = useApi();
  const channels = useSelector(selectChannelsNames);

  const validationSchema = object({
    name: string()
      .trim()
      .required()
      .min(3)
      .max(20)
      .notOneOf(channels),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async ({ name }, { setSubmitting }) => {
      try {
        const { id } = await addChannel({ name });

        dispatch(actions.setCurrentChannel({ channelId: id }));
        toast.success(t('channels.created'));
        handleClose();
      } catch (error) {
        if (error.isAxiosError) {
          toast.error(t('errors.network'));
        } else {
          toast.error(t('errors.unknown'));
        }

        input.current.select();
        throw error;
      }

      setSubmitting(false);
    },
  });

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('modals.add')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label={t('modals.close')}
          data-bs-dismiss="modal"
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              className="mb-2"
              disabled={formik.isSubmitting}
              ref={input}
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Label visuallyHidden>{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default AddChannel;
