import { Paper } from '@mui/material';
import { ByGenreChart } from '@renderer/components';
import { Movie } from '@renderer/types';
import { useEffect, useState } from 'react';

export function Stats() {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('get-movies');
      setMovieList(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="PageHeader">Statistics</div>
      <Paper elevation={1} className="StatPaper">
        <ByGenreChart movieList={movieList} />
      </Paper>
    </>
  );
}
