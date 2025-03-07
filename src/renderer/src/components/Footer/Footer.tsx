import { useEffect, useState } from 'react';
import './Footer.css';

export function Footer() {
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    const fetchVersion = async () => {
      const response = await window.electron.ipcRenderer.invoke('get-app-version');
      setAppVersion(response);
    };

    fetchVersion();
  }, []);

  return (
    <footer className="FooterContainer">
      <div>v.{appVersion} | </div>
      <img className="TMDBLogo" src="tmdb-logo.svg" alt="TMDB Logo" />
      <div>This product uses the TMDB API but is not endorsed or certified by TMDB.</div>
    </footer>
  );
}
