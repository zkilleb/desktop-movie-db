import './AddMovie.css';
import React from 'react';
import {
  Paper,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { Notification } from '../../components';
import { Validation, Rating } from '../../types';
import { useNavigate } from 'react-router-dom';
import { HelpOutline } from '@mui/icons-material';

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
  const [addAnotherMovie, setAddAnotherMovie] = React.useState<boolean>(false);

  const [open, setOpen] = React.useState(false);
  const [validation, setValidation] = React.useState<Validation>();
  const navigate = useNavigate();

  const clearTextFields = () => {
    setTitle('');
    setRuntime('');
    setReleaseYear('');
    setColor(true);
    setLanguage('');
    setDirector('');
    setStudio('');
    setNotes('');
    setGenre('');
    setRating('');
  };

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
                label="Title *"
                id="title"
                value={title ? title : ''}
                onChange={handleChange}
              />
              <TextField
                className="AddMovieField"
                label="Runtime"
                type="number"
                id="runtime"
                value={runtime ? runtime : ''}
                onChange={handleChange}
                helperText="In minutes"
              />
              <TextField
                className="AddMovieField"
                type="number"
                label="Release Year *"
                id="releaseYear"
                value={releaseYear ? releaseYear : ''}
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
                value={language ? language : ''}
                onChange={handleChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Tooltip
                        title={
                          <>
                            For proper application behavior, please seperate muiltiple languages
                            with a comma, e.g., English, Spanish
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
                label="Director *"
                id="director"
                value={director ? director : ''}
                onChange={handleChange}
              />
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
                            For proper application behavior, please seperate muiltiple genres with a
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
            </div>
            <div className="AddMovieFieldRow">
              <FormControl>
                <InputLabel>Rating</InputLabel>
                <Select
                  id="rating"
                  className="RatingSelect"
                  label="Rating"
                  value={rating ? rating : ''}
                  onChange={(e) => setRating(e.target.value as string)}
                >
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
              </FormControl>
              <TextField
                className="AddMovieField"
                label="Notes"
                id="notes"
                value={notes ? notes : ''}
                onChange={handleChange}
                multiline
              />
            </div>
            <div className="SubmitButtonContainer">
              <Button className="AddMovieSubmit" onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            </div>
            <div className="SubmitButtonContainer">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => setAddAnotherMovie(!addAnotherMovie)}
                    style={{ color: '#00b020' }}
                    value={addAnotherMovie}
                  />
                }
                label="Add Another Movie"
              />
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
        const response = await window.electron.ipcRenderer.invoke('add-movie', {
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
        if (addAnotherMovie) {
          setValidation({
            message: 'Succesfully wrote movie to database',
            severity: 'success'
          });
          setOpen(true);
          clearTextFields();
        } else {
          navigate(`/movie/${response}`);
        }
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
