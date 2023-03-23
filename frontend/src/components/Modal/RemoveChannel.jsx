import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useApi } from '../../hooks';

const RemoveChannel = ({ handleClose }) => {
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
      if (error.isAxiosError) {
        toast.error(t('errors.network'));
      } else {
        toast.error(t('errors.unknown'));
      }

      setLoading(false);
      throw error;
    }
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label={t('modals.close')}
          data-bs-dismiss="modal"
        />
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.confirmation')}</p>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleRemove}
            disabled={loading}
          >
            {t('modals.confirm')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default RemoveChannel;
