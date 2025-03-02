import './Toolbar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Box, Toolbar as MuiToolbar } from '@mui/material';
import { Search, AddCircleOutline, Settings } from '@mui/icons-material';
import { SettingsModal } from '../SettingsModal/SettingsModal';

export function Toolbar({ loading }: { loading: boolean }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {/* Loading here to prevent race condition of modal getting out of date config before it can be reloaded */}
      {!loading && <SettingsModal open={settingsOpen} handleClose={() => setSettingsOpen(false)} />}
      <Box className="HeaderBox">
        <AppBar position="static">
          <MuiToolbar className="Toolbar">
            <Link className="HomeLink" to="/">
              <div>Movie Database</div>
            </Link>
            <div className="LeftToolBarContainer">
              <Link className="HomeLink" to="/movies">
                Movies
              </Link>
            </div>
            <div className="RightToolBarContainer">
              <div className="AddIcon">
                <Settings onClick={() => setSettingsOpen(true)} />
              </div>
              <div className="AddIcon">
                <Link className="HomeLink" to="/add">
                  <AddCircleOutline />
                </Link>
              </div>
              <div className="AddIcon">
                <Search />
              </div>
            </div>
          </MuiToolbar>
        </AppBar>
      </Box>
    </>
  );
}
