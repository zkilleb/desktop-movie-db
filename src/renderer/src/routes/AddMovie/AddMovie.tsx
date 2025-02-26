import './AddMovie.css';
import React from 'react';
import { Paper, Button, FormControlLabel, Checkbox, TextField } from '@mui/material';

export function AddMovie() {
  const [title, setTitle] = React.useState<string>('');
  const [length, setLength] = React.useState<string>('');
  const [year, setYear] = React.useState<string>('');
  const [color, setColor] = React.useState<boolean>(true);
  const [language, setLanguage] = React.useState<string>('');
  const [director, setDirector] = React.useState<string>('');
  const [studio, setStudio] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');
  const [genre, setGenre] = React.useState<string>('');

  return (
    <div>
      <div className="PageHeader">Add New Movie</div>
      <Paper elevation={1}>
        <form className="AddMovieForm" noValidate autoComplete="off">
          <TextField
            className="AddMovieField"
            label="Title"
            id="title"
            value={title}
            onChange={handleChange}
          />
          <TextField
            label="Runtime"
            id="length"
            value={length}
            onChange={handleChange}
            helperText="In minutes"
          />
          <TextField
            label="Release Year"
            id="year"
            value={year}
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
          <TextField label="Language(s)" id="language" value={language} onChange={handleChange} />
          <TextField label="Director" id="director" value={director} onChange={handleChange} />
          <TextField label="Studio" id="studio" value={studio} onChange={handleChange} />
          <TextField label="Genre" id="genre" value={genre} onChange={handleChange} />
          <TextField label="Notes" id="notes" value={notes} onChange={handleChange} />
          <div className="SubmitButtonContainer">
            <Button className="AddMovieSubmit" onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case 'title':
        setTitle(event.target.value);
        break;
      case 'length':
        setLength(event.target.value.replace(/[^0-9]/g, ''));
        break;
      case 'year':
        setYear(event.target.value.replace(/[^0-9]/g, ''));
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

  async function handleSubmit() {}
}

// const addMovie = (): void =>
//   window.electron.ipcRenderer.send('add-movie', {
//     title: 'Test',
//     rating: 'R',
//     runtime: 127,
//     director: 'Steve Man',
//     releaseYear: 1994
//   });
