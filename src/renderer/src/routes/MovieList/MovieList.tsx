import { useEffect, useState } from 'react';
import './MovieList.css';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Movie } from '../../types';

export function MovieList() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('get-movies');
      setMovieList(result);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="PageHeader">Movie List</div>
      <TableContainer className="MovieListTable" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Director</TableCell>
              <TableCell align="center">Release Year</TableCell>
              <TableCell align="center">Runtime</TableCell>
              <TableCell align="center">Rating</TableCell>
              <TableCell align="center">Color</TableCell>
              <TableCell align="center">Language</TableCell>
              <TableCell align="center">Studio</TableCell>
              <TableCell align="center">Genre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movieList.map((movie) => {
              return (
                <TableRow key={movie.ID} onDoubleClick={() => navigate(`/movie/${movie.ID}`)}>
                  <TableCell align="center">{movie.Title}</TableCell>
                  <TableCell align="center">{movie.Director}</TableCell>
                  <TableCell align="center">{movie.ReleaseYear}</TableCell>
                  <TableCell align="center">{movie.Runtime}</TableCell>
                  <TableCell align="center">{movie.Rating}</TableCell>
                  <TableCell align="center">{movie.Color ? 'True' : 'False'}</TableCell>
                  <TableCell align="center">{movie.Language}</TableCell>
                  <TableCell align="center">{movie.Studio}</TableCell>
                  <TableCell align="center">{movie.Genre}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
