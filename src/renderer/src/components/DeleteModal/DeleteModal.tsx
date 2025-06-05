import { Validation } from '@renderer/types';
import { Notification } from '../../components';
import './DeleteModal.css';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DeleteModal({
  title,
  id,
  handleClose,
  open,
  handleCallback
}: {
  title: string;
  id: string;
  handleClose: () => void;
  open: boolean;
  handleCallback?: () => void;
}) {
  const [validation, setValidation] = useState<Validation>();
  const [validationOpen, setValidationOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await window.electron.ipcRenderer.invoke('delete-movie', { id });
      navigate('/movies');
      if (handleCallback) {
        handleCallback();
      }
    } catch (e) {
      setValidation({ message: 'Problem deleting movie', severity: 'error' });
      setValidationOpen(true);
    }
  };

  return (
    <>
      {validation && validationOpen && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={!!validation}
          handleClose={() => setValidationOpen(false)}
        />
      )}

      <Dialog className="WarningText" onClose={handleClose} open={open}>
        <DialogTitle>Delete {title}?</DialogTitle>
        <div className="WarningText">This change cannot be undone</div>
        <DialogActions>
          <Button className="DeleteCancel" onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button className="DeleteSubmit" onClick={handleDelete} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
