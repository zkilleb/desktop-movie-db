import './AddMovie.css';
import React from 'react';
import {
  Paper,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  FormControl,
  Box
} from '@mui/material';
import { Notification } from '../../components';
import { Validation, Rating } from '../../types';

export function AddMovie() {
  const [title, setTitle] = React.useState<string>();
  const [runtime, setRuntime] = React.useState<string>();
  const [releaseYear, setReleaseYear] = React.useState<string>();
  const [color, setColor] = React.useState<boolean>(true);
  const [language, setLanguage] = React.useState<string>();
  const [director, setDirector] = React.useState<string>();
  const [studio, setStudio] = React.useState<string>();
  const [notes, setNotes] = React.useState<string>();
  const [genre, setGenre] = React.useState<string>();
  const [rating, setRating] = React.useState<string>();

  const [open, setOpen] = React.useState(false);
  const [validation, setValidation] = React.useState<Validation>();

  return (
    <>
      {validation && open && (
        <Notification
          message={validation.message}
          severity={validation.severity}
          open={!!validation}
          handleClose={() => setOpen(false)}
        />
      )}
      <div>
        <div className="PageHeader">Add New Movie</div>
        <Paper elevation={1} className="AddMovieFormWrapper">
          <form className="AddMovieForm" noValidate autoComplete="off">
            <div className="AddMovieFieldRow">
              <TextField
                className="AddMovieField"
                label="Title"
                id="title"
                value={title}
                onChange={handleChange}
              />
              <TextField
                className="AddMovieField"
                label="Runtime"
                type="number"
                id="runtime"
                value={runtime}
                onChange={handleChange}
                helperText="In minutes"
              />
              <TextField
                className="AddMovieField"
                type="number"
                label="Release Year"
                id="releaseYear"
                value={releaseYear}
                onChange={handleChange}
                placeholder="YYYY"
              />
              <FormControlLabel
                className="AddMovieCheckbox"
                control={
                  <Checkbox
                    checked={color}
                    onChange={handleChange}
                    style={{ color: '#00b020' }}
                    id="color"
                  />
                }
                label="Color"
              />
            </div>
            <div className="AddMovieFieldRow">
              <TextField
                className="AddMovieField"
                label="Language(s)"
                id="language"
                value={language}
                onChange={handleChange}
              />
              <TextField
                className="AddMovieField"
                label="Director"
                id="director"
                value={director}
                onChange={handleChange}
              />
              <TextField
                className="AddMovieField"
                label="Studio"
                id="studio"
                value={studio}
                onChange={handleChange}
              />
              <TextField
                className="AddMovieField"
                label="Genre"
                id="genre"
                value={genre}
                onChange={handleChange}
              />
            </div>
            <div className="AddMovieFieldRow">
              <FormControl>
                <InputLabel>Rating</InputLabel>
                <Select
                  id="rating"
                  className="RatingSelect"
                  label="Rating"
                  onChange={(e) => setRating(e.target.value as string)}
                >
                  <div>
                    {Object.values(Rating)
                      .filter((value) => isNaN(Number(value)))
                      .map((rating) => {
                        return (
                          <MenuItem key={rating} value={rating}>
                            {rating}
                          </MenuItem>
                        );
                      })}
                  </div>
                </Select>
              </FormControl>
              <TextField
                className="AddMovieField"
                label="Notes"
                id="notes"
                value={notes}
                onChange={handleChange}
                multiline
              />
            </div>
            <div className="SubmitButtonContainer">
              <Button className="AddMovieSubmit" onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidation(undefined);
    switch (event.target.id) {
      case 'title':
        setTitle(event.target.value);
        break;
      case 'runtime':
        setRuntime(event.target.value.replace(/[^0-9]/g, ''));
        break;
      case 'releaseYear':
        setReleaseYear(event.target.value.replace(/[^0-9]/g, ''));
        break;
      case 'color':
        setColor(event.target.checked);
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
      case 'notes':
        setNotes(event.target.value);
        break;
    }
  }

  async function handleSubmit() {
    if (title && director && releaseYear) {
      try {
        const result = await window.electron.ipcRenderer.invoke('add-movie', {
          title: title,
          rating: rating,
          runtime: runtime,
          director: director,
          releaseYear: releaseYear,
          color: color,
          studio: studio,
          language: language,
          genre: genre,
          notes: notes
        });
        console.log(result);
      } catch (e) {
        setValidation({
          message: 'Problem writing movie to database',
          severity: 'error'
        });
        setOpen(true);
      }
    } else {
      setValidation({
        message: 'Title, director and year are required',
        severity: 'error'
      });
      setOpen(true);
    }
  }
}
