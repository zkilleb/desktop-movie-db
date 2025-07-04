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
import { FilterParams, Movie } from '../../types';
import { DeleteModal } from '@renderer/components';
import { FilterModal } from '@renderer/components/FilterModal/FilterModal';

export function MovieList() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [filterdList, setFilteredList] = useState<Movie[]>(movieList);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<string>();
  const [tempDeleteTitle, setTempDeleteTitle] = useState<string>();
  const [filterParams, setFilterParams] = useState<FilterParams>();
  const [filterPills, setFilterPills] = useState<{ value: string; field: string }[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await window.electron.ipcRenderer.invoke('get-movies');
      setMovieList(result);
      setFilteredList(result);
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
    setFilteredList(filteredMovieList);
    setDeleteOpen(false);
    setTempDeleteId(undefined);
    setTempDeleteTitle(undefined);
  };

  const handleFilter = (params: FilterParams) => {
    setFilterParams(params);
    setFilterOpen(false);
    let currentFilterPills: { value: string; field: string }[] = [];
    let appliedFilters: { (movie: Movie) }[] = [];
    Object.keys(params).forEach((filter) => {
      switch (filter) {
        case 'title':
          if (params[filter]) {
            currentFilterPills.push({ value: `Title: ${params[filter]}`, field: filter });
            appliedFilters.push((movie: Movie) => {
              return movie.Title.toLowerCase().includes(params[filter]?.toLowerCase() || '');
            });
          }
          break;
        case 'genre':
          if (params[filter]) {
            currentFilterPills.push({ value: `Genre(s): ${params[filter]}`, field: filter });
            appliedFilters.push((movie) => {
              return (
                movie.Genre &&
                params[filter]
                  ?.split(',')
                  .some((el) => movie.Genre.toLowerCase().includes(el.toLowerCase().trim()))
              );
            });
          }
          break;
        case 'color':
          if (params[filter] !== 'both') {
            currentFilterPills.push({
              value: `Color: ${params[filter] === 'bw' ? 'Black & White' : 'Color'}`,
              field: filter
            });
            const translatedColor = params[filter] === 'bw' ? false : true;
            appliedFilters.push((movie: Movie) => {
              return translatedColor === Boolean(movie.Color);
            });
          }
          break;
        case 'studio':
          if (params[filter]) {
            currentFilterPills.push({ value: `Studio: ${params[filter]}`, field: filter });
            appliedFilters.push((movie: Movie) => {
              return (
                movie.Studio &&
                movie.Studio.toLowerCase().includes(params[filter]?.toLowerCase() || '')
              );
            });
          }
          break;
        case 'language':
          if (params[filter]) {
            currentFilterPills.push({ value: `Language(s): ${params[filter]}`, field: filter });
            appliedFilters.push((movie) => {
              return (
                movie.Language &&
                params[filter]
                  ?.split(',')
                  .some((el) => movie.Language.toLowerCase().includes(el.toLowerCase().trim()))
              );
            });
          }
          break;
        case 'director':
          if (params[filter]) {
            currentFilterPills.push({ value: `Director: ${params[filter]}`, field: filter });
            appliedFilters.push((movie: Movie) => {
              return (
                movie.Director &&
                params[filter]
                  ?.split(',')
                  .some((el) => movie.Director.toLowerCase().includes(el.toLowerCase().trim()))
              );
            });
          }
          break;
        case 'rating':
          if (params[filter]) {
            currentFilterPills.push({ value: `Rating: ${params[filter]}`, field: filter });
            appliedFilters.push((movie: Movie) => {
              return (
                movie.Rating &&
                movie.Rating.toLowerCase().includes(params[filter]?.toLowerCase() || '')
              );
            });
          }
          break;
        case 'releaseYear':
          if (
            params[filter] &&
            params.releaseYearMarks &&
            (params[filter][0] !== params.releaseYearMarks[0].value ||
              params[filter][1] !== params.releaseYearMarks[1].value)
          ) {
            currentFilterPills.push({
              value: `Release Year: ${params[filter][0]}-${params[filter][1]}`,
              field: filter
            });
            appliedFilters.push((movie: Movie) => {
              return (
                movie.ReleaseYear &&
                params[filter] &&
                movie.ReleaseYear >= params[filter][0] &&
                movie.ReleaseYear <= params[filter][1]
              );
            });
          }
          break;
        case 'runtime':
          if (
            params[filter] &&
            params.runtimeMarks &&
            (params[filter][0] !== params.runtimeMarks[0].value ||
              params[filter][1] !== params.runtimeMarks[1].value)
          ) {
            currentFilterPills.push({
              value: `Runtime: ${params[filter][0]}-${params[filter][1]} mins.`,
              field: filter
            });
            appliedFilters.push((movie: Movie) => {
              return (
                movie.Runtime &&
                params[filter] &&
                movie.Runtime >= params[filter][0] &&
                movie.Runtime <= params[filter][1]
              );
            });
          }
          break;
      }
    });
    setFilterPills(currentFilterPills);
    setFilteredList([...movieList].filter(combineFilters(...appliedFilters)));
  };

  const handleFilterDelete = (filter: { value: string; field: string }) => {
    if (filterPills && filterParams) {
      let tempFilters = [...filterPills];
      const filteredArr = tempFilters.filter((tempFilter) => tempFilter.value !== filter.value);
      const tempParams = JSON.parse(JSON.stringify(filterParams));
      if (filter.field !== 'color') {
        tempParams[filter.field] = undefined;
      } else {
        tempParams[filter.field] = 'both';
      }
      handleFilter(tempParams);
      setFilterPills(filteredArr);
    }
  };

  const combineFilters =
    (...filters) =>
    (item) => {
      return filters.map((filter) => filter(item)).every((x) => x === true);
    };

  return (
    <>
      {filterOpen && (
        <FilterModal
          filterParams={filterParams}
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
        <div className="FilterContainer">
          <div className="FilterPillContainer">
            {filterPills &&
              filterPills.length > 0 &&
              filterPills.map((filter) => {
                return (
                  <Chip
                    className="FilterChip"
                    variant="outlined"
                    onDelete={() => handleFilterDelete(filter)}
                    label={filter.value}
                  />
                );
              })}
          </div>
          {movieList.length > 0 && (
            <div className="FilterSubHeader">
              <FilterAlt onClick={() => setFilterOpen(!filterOpen)} />
            </div>
          )}
        </div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {COLUMN_TITLES.map((column) => {
                return <TableCell align="center">{column}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {filterdList.length > 0 ? (
              filterdList.map((movie) => {
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
