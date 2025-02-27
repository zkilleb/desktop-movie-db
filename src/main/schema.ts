export const MOVIE_SCHEMA = [
  { name: 'ID', type: 'INTEGER' },
  { name: 'Title', type: 'TEXT' },
  { name: 'Director', type: 'TEXT' },
  { name: 'ReleaseYear', type: 'INTEGER' },
  { name: 'Runtime', type: 'INTEGER' },
  { name: 'Rating', type: 'TEXT' },
  { name: 'Color', type: 'INTEGER' }, //SQLite does not have a Boolean type, instead use 0 or 1
  { name: 'Language', type: 'TEXT' },
  { name: 'Studio', type: 'TEXT' },
  { name: 'Genre', type: 'TEXT' },
  { name: 'Notes', type: 'TEXT' }
];

export const RELEASE_SCHEMA = [
  { name: 'ID', type: 'INTEGER' },
  { name: 'Title', type: 'TEXT' },
  { name: 'Format', type: 'TEXT' }
];
