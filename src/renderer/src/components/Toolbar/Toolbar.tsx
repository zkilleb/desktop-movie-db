import './Toolbar.css';
import { AppBar, Box, Toolbar as MuiToolbar } from '@mui/material';
import { Search } from '@mui/icons-material';

export function Toolbar() {
  return (
    <Box className="HeaderBox">
      <AppBar position="static">
        <MuiToolbar className="Toolbar">
          <div>Movie Database</div>
          <div className="RightToolBarContainer">
            <Search />
          </div>
        </MuiToolbar>
      </AppBar>
    </Box>
  );
}
