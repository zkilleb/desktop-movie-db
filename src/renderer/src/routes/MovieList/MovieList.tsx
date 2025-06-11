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
  Paper,
  Chip
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
  const [filters, setFilters] = useState<string[]>();
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

  const handleFilter = (params: {
    title?: string;
    genre?: string;
    color?: string;
    studio?: string;
    language?: string;
    director?: string;
    rating?: string;
    releaseYear?: number[];
    runtime?: number[];
    releaseYearMarks?:
      | false
      | {
          value: number;
          label: number;
        }[];
    runtimeMarks?:
      | false
      | {
          value: number;
          label: string;
        }[];
  }) => {
    setFilterOpen(false);
    const currentFilters: string[] = [];
    Object.keys(params).forEach((filter) => {
      switch (filter) {
        case 'title':
          if (params[filter]) {
            currentFilters.push(`Title: ${params[filter]}`);
          }
          break;
        case 'genre':
          if (params[filter]) {
            currentFilters.push(`Genre(s): ${params[filter]}`);
          }
          break;
        case 'color':
          if (params[filter] !== 'both') {
            currentFilters.push(`Color: ${params[filter] === 'bw' ? 'Black & White' : 'Color'}`);
          }
          break;
        case 'studio':
          if (params[filter]) {
            currentFilters.push(`Studio: ${params[filter]}`);
          }
          break;
        case 'language':
          if (params[filter]) {
            currentFilters.push(`Language(s): ${params[filter]}`);
          }
          break;
        case 'director':
          if (params[filter]) {
            currentFilters.push(`Director: ${params[filter]}`);
          }
          break;
        case 'rating':
          if (params[filter]) {
            currentFilters.push(`Rating: ${params[filter]}`);
          }
          break;
        case 'releaseYear':
          if (
            params[filter] &&
            params.releaseYearMarks &&
            (params[filter][0] !== params.releaseYearMarks[0].value ||
              params[filter][1] !== params.releaseYearMarks[1].value)
          ) {
            currentFilters.push(`Release Year: ${params[filter][0]}-${params[filter][1]}`);
          }
          break;
        case 'runtime':
          if (
            params[filter] &&
            params.runtimeMarks &&
            (params[filter][0] !== params.runtimeMarks[0].value ||
              params[filter][1] !== params.runtimeMarks[1].value)
          ) {
            currentFilters.push(`Runtime: ${params[filter][0]}-${params[filter][1]} mins.`);
          }
          break;
      }
    });
    setFilters(currentFilters);
  };

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
        {filters &&
          filters.length > 0 &&
          filters.map((filter) => {
            return <Chip label={filter} />;
          })}
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
