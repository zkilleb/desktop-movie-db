import * as fs from 'fs';
import { app, dialog } from 'electron';
import path from 'node:path';
import { shell } from 'electron';

export function exportCsv({ filename, filecontents }: { filename: string; filecontents: string }) {
  const DOWNLOAD_PATH = path.join(app.getPath('downloads'), filename);
  fs.writeFile(DOWNLOAD_PATH, filecontents, 'utf8', (err) => {
    if (err) {
      console.log('Error writing file:', err.message);
      return;
    }
  });
  return { status: 200, message: 'File written succesfully' };
}

export function openCsv({ filename }: { filename: string }) {
  const DOWNLOAD_PATH = path.join(app.getPath('downloads'), filename);
  shell.openPath(DOWNLOAD_PATH);
}

export async function selectImportCsvFile() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'CSV', extensions: ['csv'] }]
  });
  return { status: 200, filename: result.filePaths[0] };
}
