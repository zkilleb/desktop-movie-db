import { Movie, TMDBResult } from '@renderer/types';
import './MovieDetail.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTMDBMovieIdByKeyword } from '@renderer/tmdbHandlers/tmdbHandlers';
import { Delete } from '@mui/icons-material';
import { DeleteModal } from '@renderer/components';

export function MovieDetail() {
  const [movieData, setMovieData] = useState<Movie>();
  const [tmdbData, setTmdbData] = useState<TMDBResult>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // TODO: Do we need to refetch or would prop drilling be better?
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('get-movie-details', { id });
      setMovieData(result[0]);
      if (result && localStorage.getItem('tmdbApi')) {
        const tmdbResult = await getTMDBMovieIdByKeyword(result[0].Title, result[0].ReleaseYear);
        setTmdbData(tmdbResult);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {movieData && (
        <>
          {deleteOpen && (
            <DeleteModal
              id={movieData.ID}
              title={movieData.Title}
              open={deleteOpen}
              handleClose={() => setDeleteOpen(!deleteOpen)}
            />
          )}
          <div className="PageHeader">{movieData.Title}</div>
          <div className="DeleteButtonContainer">
            <Delete className="DeleteButton" onClick={() => setDeleteOpen(true)} />
          </div>
          <div>
            {tmdbData?.poster_path ? (
              <img
                className="SearchResultPoster"
                src={`https://image.tmdb.org/t/p/original${tmdbData.poster_path}`}
                alt={`${movieData?.Title} poster`}
                width="160.05"
                height="240"
              />
            ) : (
              <div className="SearchResultNoPoster">No Poster Found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
