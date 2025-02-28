import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { darkTheme } from './themes';
import { Toolbar } from './components';
import { Home, AddMovie, MovieList } from './routes';

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <HashRouter>
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddMovie />} />
            <Route path="/movies" element={<MovieList />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
