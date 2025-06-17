import './FilterModal.css';
import {
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  Tooltip,
  Select,
  MenuItem
} from '@mui/material';
import { FilterParams, Movie, Rating } from '@renderer/types';
import { useState } from 'react';
import { RangeSlider } from '../RangeSlider/RangeSlider';
import { HelpOutline } from '@mui/icons-material';

export function FilterModal({
  open,
  handleClose,
  handleFilterSubmit,
  movieList,
  filterParams
}: {
  open: boolean;
  handleClose: () => void;
  handleFilterSubmit: (params: FilterParams) => void;
  movieList: Movie[];
  filterParams?: FilterParams;
}) {
  const sortedByReleaseYearMovies = movieList
    .sort((x, y) => x?.ReleaseYear - y?.ReleaseYear)
    .filter((movie) => movie.ReleaseYear);
  const sortedByRuntimeMovies = movieList
    .sort((x, y) => x?.Runtime - y?.Runtime)
    .filter((movie) => movie.Runtime);
  const [title, setTitle] = useState<string | undefined>(
    filterParams && filterParams.title ? filterParams.title : undefined
  );
  const [genre, setGenre] = useState<string | undefined>(
    filterParams && filterParams.genre ? filterParams.genre : undefined
  );
  const [studio, setStudio] = useState<string | undefined>(
    filterParams && filterParams.studio ? filterParams.studio : undefined
  );
  const [language, setLanguage] = useState<string | undefined>(
    filterParams && filterParams.language ? filterParams.language : undefined
  );
  const [color, setColor] = useState<string>(
    filterParams && filterParams.color ? filterParams.color : 'both'
  );
  const [director, setDirector] = useState<string | undefined>(
    filterParams && filterParams.director ? filterParams.director : undefined
  );
  const [rating, setRating] = useState<string | undefined>(
    filterParams && filterParams.rating ? filterParams.rating : undefined
  );
  const [releaseYear, setReleaseYear] = useState<number[]>([
    filterParams && filterParams.releaseYear
      ? filterParams.releaseYear[0]
      : sortedByReleaseYearMovies.length > 0
        ? sortedByReleaseYearMovies[0].ReleaseYear
        : 0,
    filterParams && filterParams.releaseYear
      ? filterParams.releaseYear[1]
      : sortedByReleaseYearMovies.length > 0
        ? sortedByReleaseYearMovies[sortedByReleaseYearMovies.length - 1].ReleaseYear
        : 0
  ]);
  const [runtime, setRuntime] = useState<number[]>([
    filterParams && filterParams.runtime
      ? filterParams.runtime[0]
      : sortedByRuntimeMovies.length > 0
        ? sortedByRuntimeMovies[0].Runtime
        : 0,
    filterParams && filterParams.runtime
      ? filterParams.runtime[1]
      : sortedByRuntimeMovies.length > 0
        ? sortedByRuntimeMovies[sortedByRuntimeMovies.length - 1].Runtime
        : 0
  ]);

  const releaseYearMarks =
    sortedByReleaseYearMovies.length > 0
      ? [
          {
            value: sortedByReleaseYearMovies[0].ReleaseYear,
            label: sortedByReleaseYearMovies[0].ReleaseYear
          },
          {
            value: sortedByReleaseYearMovies[sortedByReleaseYearMovies.length - 1].ReleaseYear,
            label: sortedByReleaseYearMovies[sortedByReleaseYearMovies.length - 1].ReleaseYear
          }
        ]
      : false;

  const runtimeMarks =
    sortedByRuntimeMovies.length > 0
      ? [
          {
            value: sortedByRuntimeMovies[0].Runtime,
            label: `${sortedByRuntimeMovies[0].Runtime} mins`
          },
          {
            value: sortedByRuntimeMovies[sortedByRuntimeMovies.length - 1].Runtime,
            label: `${sortedByRuntimeMovies[sortedByRuntimeMovies.length - 1].Runtime} mins`
          }
        ]
      : false;

  return (
    <Dialog className="WarningText" onClose={handleClose} open={open}>
      <DialogTitle>Filter Options</DialogTitle>
      <DialogContent>
        <div className="AddMovieFieldRow">
          <TextField
            className="AddMovieField"
            label="Title"
            id="title"
            value={title ? title : ''}
            onChange={handleChange}
          />
          <TextField
            className="AddMovieField"
            label="Director(s)"
            id="director"
            value={director ? director : ''}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip
                    title={
                      <>
                        For proper application behavior, please seperate multiple directors with a
                        comma, e.g., Coen, Kubrick
                      </>
                    }
                  >
                    <InputAdornment position="end">
                      <HelpOutline />
                    </InputAdornment>
                  </Tooltip>
                )
              }
            }}
          />
          <TextField
            className="AddMovieField"
            label="Language(s)"
            id="language"
            value={language ? language : ''}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip
                    title={
                      <>
                        For proper application behavior, please seperate multiple languages with a
                        comma, e.g., English, Spanish
                      </>
                    }
                  >
                    <InputAdornment position="end">
                      <HelpOutline />
                    </InputAdornment>
                  </Tooltip>
                )
              }
            }}
          />
        </div>
        <div className="AddMovieFieldRow">
          <TextField
            className="AddMovieField"
            label="Studio"
            id="studio"
            value={studio ? studio : ''}
            onChange={handleChange}
          />
          <TextField
            className="AddMovieField"
            label="Genre(s)"
            id="genre"
            value={genre ? genre : ''}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip
                    title={
                      <>
                        For proper application behavior, please seperate multiple genres with a
                        comma, e.g., Horror, Comedy
                      </>
                    }
                  >
                    <InputAdornment position="end">
                      <HelpOutline />
                    </InputAdornment>
                  </Tooltip>
                )
              }
            }}
          />
          <div>
            <div className="ColorFilterHeader">Rating</div>
            <Select
              id="rating"
              className="RatingSelect"
              label="Rating"
              value={rating ? rating : ''}
              onChange={(e) => setRating(e.target.value as string)}
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.values(Rating)
                .filter((value) => isNaN(Number(value)))
                .map((selectedRating) => {
                  return (
                    <MenuItem key={selectedRating} value={selectedRating}>
                      {selectedRating}
                    </MenuItem>
                  );
                })}
            </Select>
          </div>
        </div>
        <div className="AddMovieFieldRow">
          <div className="ColorFilterHeader">Color</div>
          <div>
            <RadioGroup
              row
              value={color}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setColor((event.target as HTMLInputElement).value)
              }
            >
              <FormControlLabel
                value="color"
                control={<Radio style={{ color: '#00b020' }} />}
                label="Color"
              />
              <FormControlLabel
                value="bw"
                control={<Radio style={{ color: '#00b020' }} />}
                label="Black and White"
              />
              <FormControlLabel
                value="both"
                control={<Radio style={{ color: '#00b020' }} />}
                label="Both"
              />
            </RadioGroup>
          </div>
        </div>
        <div className="AddMovieFieldRow">
          <RangeSlider
            title="Release Year"
            marks={releaseYearMarks}
            value={releaseYear}
            onChangeCallback={(newValue: number[]) => setReleaseYear(newValue)}
            max={
              sortedByReleaseYearMovies.length > 0
                ? sortedByReleaseYearMovies[sortedByReleaseYearMovies.length - 1].ReleaseYear
                : 0
            }
            min={
              sortedByReleaseYearMovies.length > 0 ? sortedByReleaseYearMovies[0].ReleaseYear : 0
            }
          />
        </div>
        <div className="AddMovieFieldRow">
          <RangeSlider
            title="Runtime"
            marks={runtimeMarks}
            value={runtime}
            onChangeCallback={(newValue: number[]) => setRuntime(newValue)}
            max={
              sortedByRuntimeMovies.length > 0
                ? sortedByRuntimeMovies[sortedByRuntimeMovies.length - 1].Runtime
                : 0
            }
            min={sortedByRuntimeMovies.length > 0 ? sortedByRuntimeMovies[0].Runtime : 0}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button className="DeleteCancel" onClick={handleClear} variant="contained">
          Reset to Default
        </Button>
        <Button className="DeleteCancel" onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button
          className="DeleteSubmit"
          onClick={() =>
            handleFilterSubmit({
              title,
              genre,
              color,
              studio,
              language,
              director,
              rating,
              releaseYear,
              runtime,
              releaseYearMarks,
              runtimeMarks
            })
          }
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );

  function handleClear() {
    setTitle('');
    setRuntime(
      sortedByRuntimeMovies.length > 0
        ? [
            sortedByRuntimeMovies[0].Runtime,
            sortedByRuntimeMovies[sortedByRuntimeMovies.length - 1].Runtime
          ]
        : [0, 0]
    );
    setReleaseYear(
      sortedByReleaseYearMovies.length > 0
        ? [
            sortedByReleaseYearMovies[0].ReleaseYear,
            sortedByReleaseYearMovies[sortedByReleaseYearMovies.length - 1].ReleaseYear
          ]
        : [0, 0]
    );
    setColor('both');
    setLanguage('');
    setDirector('');
    setStudio('');
    setGenre('');
    setRating('');
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case 'title':
        setTitle(event.target.value);
        break;
      case 'language':
        setLanguage(event.target.value);
        break;
      case 'director':
        setDirector(event.target.value);
        break;
      case 'studio':
        setStudio(event.target.value);
        break;
      case 'genre':
        setGenre(event.target.value);
        break;
    }
  }
}
