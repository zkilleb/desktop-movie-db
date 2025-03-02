import { Dialog, DialogTitle, TextField, Button, InputAdornment, Tooltip } from '@mui/material';
import './SettingsModal.css';
import { useState } from 'react';
import { HelpOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { Notification } from '../../components';
import { Validation } from '@renderer/types';

export function SettingsModal({ handleClose, open }: { handleClose: () => void; open: boolean }) {
  const [tmdbApi, setTmdbApi] = useState<string | null>(
    localStorage.getItem('tmdbApi') ? localStorage.getItem('tmdbApi') : null
  );
  const [validation, setValidation] = useState<Validation>();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleSettingsSave = async () => {
    const fetchData = async () => {
      try {
        await window.electron.ipcRenderer.invoke('update-user-config', { tmdbApi });
        setNotificationOpen(true);
        setValidation({
          message: 'User configuration succesfully updated',
          severity: 'success'
        });
        if (tmdbApi) {
          localStorage.setItem('tmdbApi', tmdbApi);
        } else {
          localStorage.removeItem('tmdbApi');
        }
      } catch (e) {
        setNotificationOpen(true);
        setValidation({
          message: 'Problem updating user configuration',
          severity: 'error'
        });
      }
    };

    fetchData();
  };

  return (
    <>
      {validation && notificationOpen && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={!!validation}
          handleClose={() => setNotificationOpen(false)}
        />
      )}

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Settings</DialogTitle>
        <TextField
          type={passwordVisible ? 'normal' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <>
                  <InputAdornment
                    style={{ cursor: 'pointer' }}
                    position="end"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </InputAdornment>
                  <Tooltip
                    title={
                      <>
                        API key for TMDB. Used to collect posters and other movie details. Can be
                        registered for below: <br />
                        https://developer.themoviedb.org/reference/intro/getting-started"
                      </>
                    }
                  >
                    <InputAdornment position="end">
                      <HelpOutline />
                    </InputAdornment>
                  </Tooltip>
                </>
              )
            }
          }}
          className="AddMovieField"
          label="TMDB API Key"
          value={tmdbApi}
          onChange={(e) => {
            setValidation(undefined);
            setTmdbApi(e.target.value);
          }}
        />
        <Button className="SettingsSubmit" onClick={handleSettingsSave} variant="contained">
          Save
        </Button>
      </Dialog>
    </>
  );
}
