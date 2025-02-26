import { useState, useEffect } from 'react';
import './Home.css';
import { DBEmpty } from '@renderer/components';

export function Home() {
  const [isEmpty, setIsEmpty] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('is-movie-empty');
      setIsEmpty(result);
    };

    fetchData();
  }, []);

  return <div>{isEmpty && <DBEmpty />}</div>;
}
