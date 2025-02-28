import './Toolbar.css';
import { Link } from 'react-router-dom';
import { AppBar, Box, Toolbar as MuiToolbar } from '@mui/material';
import { Search, AddCircleOutline } from '@mui/icons-material';

export function Toolbar() {
  return (
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
  );
}
