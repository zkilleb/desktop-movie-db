import { useEffect, useState } from 'react';
import './MovieList.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Delete, FilterAlt } from '@mui/icons-material';
import { Movie } from '../../types';
import { DeleteModal } from '@renderer/components';
import { FilterModal } from '@renderer/components/FilterModal/FilterModal';

export function MovieList() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<string>();
  const [tempDeleteTitle, setTempDeleteTitle] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('get-movies');
      setMovieList(result);
    };

    fetchData();
  }, []);

  const handleDelete = (id: string, title: string) => {
    setDeleteOpen(true);
    setTempDeleteId(id);
    setTempDeleteTitle(title);
  };

  const handleDeleteCallback = () => {
    const filteredMovieList = [...movieList].filter((movie) => movie.ID !== tempDeleteId);
    setMovieList(filteredMovieList);
    setDeleteOpen(false);
    setTempDeleteId(undefined);
    setTempDeleteTitle(undefined);
  };

  const handleFilter = () => {};

  return (
    <>
      {filterOpen && (
        <FilterModal
          open={filterOpen}
          handleFilterSubmit={handleFilter}
          handleClose={() => setFilterOpen(!filterOpen)}
          movieList={movieList}
        />
      )}
      {deleteOpen && tempDeleteId && tempDeleteTitle && (
        <DeleteModal
          id={tempDeleteId}
          title={tempDeleteTitle}
          open={deleteOpen}
          handleCallback={handleDeleteCallback}
          handleClose={() => {
            setDeleteOpen(!deleteOpen);
            setTempDeleteId(undefined);
            setTempDeleteTitle(undefined);
          }}
        />
      )}
      <div className="PageHeader">Movie List</div>
      <TableContainer className="MovieListTable" component={Paper}>
        {movieList.length > 0 && (
          <div className="FilterSubHeader">
            <FilterAlt onClick={() => setFilterOpen(!filterOpen)} />
          </div>
        )}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {COLUMN_TITLES.map((column) => {
                return <TableCell align="center">{column}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {movieList.length > 0 ? (
              movieList.map((movie) => {
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
                    <TableCell align="center">
                      <Delete
                        className="DeleteButton"
                        onClick={() => handleDelete(movie.ID, movie.Title)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10}>
                  <div className="EmptyMovieList">No movies currently in database.</div>
                  <Link to="/add" className="EmptyMovieList">
                    Click Here To Add One
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const COLUMN_TITLES = [
  'Title',
  'Director',
  'Release Year',
  'Runtime',
  'Rating',
  'Color',
  'Language',
  'Studio',
  'Genre',
  ''
];
