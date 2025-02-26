import { useEffect, useState } from 'react';
import { DBEmpty, Toolbar } from './components';

function App(): JSX.Element {
  const [isEmpty, setIsEmpty] = useState();
  // const addMovie = (): void =>
  //   window.electron.ipcRenderer.send('add-movie', {
  //     title: 'Test',
  //     rating: 'R',
  //     runtime: 127,
  //     director: 'Steve Man',
  //     releaseYear: 1994
  //   });

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('is-movie-empty');
      setIsEmpty(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <Toolbar />
      {isEmpty && <DBEmpty />}
    </>
  );
}

export default App;
