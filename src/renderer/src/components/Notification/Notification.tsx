import { Snackbar, Alert, AlertColor } from '@mui/material';
import './Notification.css';

export function Notification({
  message,
  severity,
  handleClose,
  open
}: {
  message: string;
  severity: string;
  handleClose: () => void;
  open: boolean;
}) {
  return (
    <Snackbar
      className="SnackbarContainer"
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity as AlertColor}>
        {message}
      </Alert>
    </Snackbar>
  );
}
