import { HashRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { darkTheme } from './themes';
import { Toolbar, Notification, Footer } from './components';
import { Validation } from './types';
import { Home, AddMovie, MovieList, MovieDetail, Stats } from './routes';

function App(): JSX.Element {
  const [validation, setValidation] = useState<Validation>();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        localStorage.clear();
        const response = await window.electron.ipcRenderer.invoke('get-user-config');
        if (response && response.tmdbApi) {
          localStorage.setItem('tmdbApi', response.tmdbApi);
        }
      } catch (e) {
        setNotificationOpen(true);
        setValidation({
          message: 'Problem reading user configuration',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      {validation && notificationOpen && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={!!validation}
          handleClose={() => setNotificationOpen(false)}
        />
      )}

      <HashRouter>
        <Toolbar loading={loading} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMovie />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
        <Footer />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
