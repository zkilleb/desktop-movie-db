import { Movie, TMDBResult } from '@renderer/types';
import './MovieDetail.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTMDBMovieIdByKeyword } from '@renderer/tmdbHandlers/tmdbHandlers';
import { Delete, Edit } from '@mui/icons-material';
import { DeleteModal, PosterModal } from '@renderer/components';

export function MovieDetail() {
  const [movieData, setMovieData] = useState<Movie>();
  const [tmdbData, setTmdbData] = useState<TMDBResult>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);

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

  const handlePosterDoubleClick = () => {
    if (tmdbData && tmdbData.poster_path) {
      setPosterOpen(true);
    }
  };

  return (
    <div>
      {movieData && (
        <>
          {posterOpen && tmdbData?.poster_path && (
            <PosterModal
              posterPath={tmdbData?.poster_path}
              open={posterOpen}
              handleClose={() => setPosterOpen(!posterOpen)}
              title={tmdbData?.title}
            />
          )}
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
            <div className="DeleteButton">
              <Edit />
              <Delete onClick={() => setDeleteOpen(true)} />
            </div>
          </div>
          <div className="MovieDetailContainer">
            <div>
              {tmdbData?.poster_path ? (
                <img
                  onClick={handlePosterDoubleClick}
                  style={{ cursor: 'pointer' }}
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
            <div className="MovieDetailText">
              <div>Director: {movieData.Director}</div>
              <div>Release Year: {movieData.ReleaseYear}</div>
              <div>Runtime: {movieData.Runtime}</div>
              <div>Genre: {movieData.Genre}</div>
              <div>Language: {movieData.Language}</div>
              <div>Rating: {movieData.Rating}</div>
              <div>Studio: {movieData.Studio}</div>
              <div>Color: {movieData.Color}</div>
              <div>Notes: {movieData.Notes}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
