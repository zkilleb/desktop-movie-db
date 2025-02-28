import { Movie } from '@renderer/types';
import './MovieDetail.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function MovieDetail() {
  const [movieData, setMovieData] = useState<Movie>();

  // TODO: Do we need to refetch or would prop drilling be better?
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('get-movie-details', { id });
      setMovieData(result[0]);
    };

    fetchData();
  }, []);

  return <div>{movieData && <div className="PageHeader">{movieData.Title}</div>}</div>;
}
