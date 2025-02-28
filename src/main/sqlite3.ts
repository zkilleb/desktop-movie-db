import { app } from 'electron';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'sqlite3';
import { MOVIE_SCHEMA, RELEASE_SCHEMA } from './schema';
import { Rating } from './types/types';

const TAG = '[sqlite3]';
const dbPath = path.join(app.getPath('userData'), 'database.sqlite3');

export function openDB() {
  return new Database(dbPath, (error) => {
    if (error) {
      console.log(TAG, 'initialize failed');
      console.log(TAG, error);
    } else {
      console.log(TAG, 'initialize success');
      console.log(TAG, dbPath);
    }
  });
}

export function initializeDB() {
  const db = openDB();
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS Movies (${MOVIE_SCHEMA.map((column) => {
        return `${column.name} ${column.type}`;
      }).toString()})`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS Release (${RELEASE_SCHEMA.map((column) => {
        return `${column.name} ${column.type}`;
      }).toString()})`
    );
  });
  db.close();
}

export async function addMovie({
  title,
  director,
  releaseYear,
  runtime,
  rating,
  color,
  language,
  studio,
  genre,
  notes
}: {
  title: string;
  director: string;
  releaseYear: number;
  runtime: number;
  rating: Rating;
  color: boolean;
  language: string;
  studio: string;
  genre: string;
  notes: string;
}) {
  const db = openDB();
  const id = uuidv4();
  const response = await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Movies (${MOVIE_SCHEMA.map((column) => {
        return column.name;
      }).toString()}) VALUES ("${id}", "${title}", "${director}", ${releaseYear}, ${runtime}, "${rating}", ${color}, "${language}", "${studio}", "${genre}", "${notes}");`,
      (error) => {
        if (error) {
          console.log('ERROR: Problem adding record to DB');
          console.log(`ERROR: ${error.message}`);
          reject(error);
        } else {
          console.log(`SUCCESS: ${id} succesfully added to DB`);
          resolve('success');
        }
      }
    );
  });
  db.close();
  return response;
}

export async function movieDBEmptyCheck() {
  const db = openDB();
  const response = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM Movies', (err, rows) => {
      if (err) {
        reject(err);
      } else resolve(rows);
    });
  });
  db.close();
  return (response as []).length === 0;
}
