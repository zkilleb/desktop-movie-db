import { Snackbar, Alert, AlertColor, Stack } from '@mui/material';
import './Notification.css';
import { OpenInNew } from '@mui/icons-material';

export function Notification({
  message,
  severity,
  handleClose,
  open,
  onClick
}: {
  message: string;
  severity: string;
  handleClose: () => void;
  open: boolean;
  onClick?: () => void;
}) {
  return (
    <Snackbar
      className="SnackbarContainer"
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClick={onClick}
    >
      <Alert onClose={handleClose} severity={severity as AlertColor}>
        <Stack alignItems="center" direction="row" gap={2}>
          {message} {onClick && <OpenInNew />}
        </Stack>
      </Alert>
    </Snackbar>
  );
}
