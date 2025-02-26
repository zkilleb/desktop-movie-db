import './Toolbar.css';
import { Link } from 'react-router-dom';
import { AppBar, Box, Toolbar as MuiToolbar } from '@mui/material';
import { Search, AddCircleOutline } from '@mui/icons-material';

export function Toolbar() {
  return (
    <Box className="HeaderBox">
      <AppBar position="static">
        <MuiToolbar className="Toolbar">
          <div>Movie Database</div>
          <div className="RightToolBarContainer">
            <div className='AddIcon'>
            <Link className="HomeLink" to="/add">
            <AddCircleOutline/>
            </Link>
            </div>
            <div className='AddIcon'>
            <Search />
            </div>
          </div>
        </MuiToolbar>
      </AppBar>
    </Box>
  );
}
