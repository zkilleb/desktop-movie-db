import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  getMovieDetails,
  initializeDB,
  movieDBEmptyCheck
} from './sqlite3';
import { updateUserConfig, getUserConfig } from './userConfig';

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('window-all-closed', () => {
  app.quit();
  mainWindow = null;
});

app.whenReady().then(() => {
  createWindow();
  if (mainWindow) {
    mainWindow.maximize();
  }
  initializeDB();
});

ipcMain.handle('add-movie', async (event, args) => {
  const result = await addMovie(args);
  return result;
});

ipcMain.handle('is-movie-empty', async () => {
  const result = await movieDBEmptyCheck();
  return result;
});

ipcMain.handle('delete-movie', async (event, args) => {
  const result = await deleteMovie(args);
  return result;
});

ipcMain.handle('get-movies', async () => {
  const result = await getAllMovies();
  return result;
});

ipcMain.handle('get-movie-details', async (event, args) => {
  const result = await getMovieDetails(args);
  return result;
});

ipcMain.handle('update-user-config', async (event, args) => {
  const result = await updateUserConfig(args);
  return result;
});

ipcMain.handle('get-user-config', async () => {
  const result = await getUserConfig();
  return result;
});

ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
