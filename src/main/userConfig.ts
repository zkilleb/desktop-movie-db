import { app } from 'electron';
import path from 'node:path';
import * as fs from 'fs';

const CONFIG_PATH = path.join(app.getPath('userData'), 'userConfig.json');

export const updateUserConfig = async ({ tmdbApi }: { tmdbApi?: string }) => {
  const response = await new Promise((resolve, reject) => {
    fs.writeFile(CONFIG_PATH, JSON.stringify({ tmdbApi, theme: 'dark' }), (err) => {
      if (err) {
        console.log(`ERROR: Problem writing to user configuration file ${CONFIG_PATH}`);
        console.log(err.message);
        reject(err);
      } else {
        console.log(`SUCCESS: User configuration file updated ${CONFIG_PATH}`);
        resolve({ tmdbApi, theme: 'dark' });
      }
    });
  });
  return response;
};

export const getUserConfig = async () => {
  const response = await new Promise((resolve, reject) => {
    fs.readFile(CONFIG_PATH, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          updateUserConfig({ tmdbApi: undefined });
          console.log(`Creating user configuration file ${CONFIG_PATH}`);
          resolve({ tmdbApi: undefined });
        } else {
          console.log(`ERROR: Problem read user configuration file ${CONFIG_PATH}`);
          console.log(err.message);
          reject(err);
        }
      } else {
        console.log(`SUCCESS: User configuration read ${CONFIG_PATH}`);
        resolve(JSON.parse(data));
      }
    });
  });
  return response;
};
