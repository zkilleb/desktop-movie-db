import './ImportModal.css';
import { Folder } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { MOVIE_LIST_COLUMN_TITLES } from '@renderer/constants';
import { Validation } from '@renderer/types';
import { useEffect, useState } from 'react';
import { Notification } from '../../components';

export function ImportModal({ open, handleClose }: { open: boolean; handleClose: () => void }) {
  const [importFile, setImportFile] = useState<string>();
  const [formattedHeaderString, setFormattedHeaderString] = useState<string>();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFileName, setImportFileName] = useState<string>();
  const [importDialogContent, setImportDialogContent] = useState<Validation>();

  const importMovieListCsv = async () => {
    const result = await window.electron.ipcRenderer.invoke('select-import-csv');
    setImportFile(result.filename);
  };

  useEffect(() => {
    let tempString = '';
    const trimmedColumn = MOVIE_LIST_COLUMN_TITLES.slice(0, MOVIE_LIST_COLUMN_TITLES.length - 1);
    MOVIE_LIST_COLUMN_TITLES.forEach(
      (column, index) => (tempString += `${column}${index < trimmedColumn.length - 1 ? ', ' : ''}`)
    );
    setFormattedHeaderString(tempString);
  }, []);

  const exportEmptyTemplate = async () => {
    setImportDialogOpen(false);
    setImportDialogContent(undefined);
    try {
      const filename = `Movie-List-Import-Template.csv`;
      const response = await window.electron.ipcRenderer.invoke('export-csv', {
        filename,
        filecontents: generateEmptyDataTemplate()
      });
      setImportDialogOpen(true);
      if (response) {
        setImportFileName(filename);
        setImportDialogContent({ message: `${filename} succesfully written`, severity: 'success' });
      } else {
        setImportDialogContent({ message: `Problem writing ${filename}`, severity: 'error' });
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const generateEmptyDataTemplate = () => {
    let tempString = '';
    const trimmedColumn = MOVIE_LIST_COLUMN_TITLES.slice(0, MOVIE_LIST_COLUMN_TITLES.length - 1);
    trimmedColumn.forEach(
      (column, index) => (tempString += `${column}${index < trimmedColumn.length - 1 ? ',' : ''}`)
    );
    tempString += '\n';
    tempString +=
      '<INSERT_TITLE_HERE>,<INSERT_DIRECTOR_HERE>,<INSERT_RELEASE_YEAR_HERE>,<INSERT_RUNTIME_HERE>,<INSERT_RATING_HERE>,<INSERT_COLOR_HERE>,<INSERT_LANGUAGE_HERE>,<INSERT_STUDIO_HERE>,<INSERT_GENRE_HERE>';
    return tempString;
  };

  const handleImport = () => {
    window.electron.ipcRenderer.invoke('import-csv', { filename: importFileName });
  };

  return (
    <>
      {importDialogContent && importDialogOpen && (
        <Notification
          message={importDialogContent.message}
          severity={importDialogContent.severity}
          open={!!importDialogContent}
          onClick={() =>
            window.electron.ipcRenderer.invoke('open-csv', { filename: importFileName })
          }
          handleClose={() => {
            setImportDialogOpen(false);
            setImportDialogContent(undefined);
          }}
        />
      )}

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Import CSV File</DialogTitle>
        <DialogContent>
          <div className="ImportExplainerText">
            Files must be formatted appropriately to be correctly imported. Files must be of type
            .csv. The csv should have a header row with the column order of:
            <div className="ImportHeaderString">{formattedHeaderString}</div>
            <div className="ImportHeaderString">
              Each movie record should be on a new line and follow the same order as the headers.
              For empty fields, leave it empty between commas. Color fields should be formatted as
              either B/W or Color. For multiple values in a field, seperate the values with a /.
              Rating must be G, PG, PG-13, R, NC-17 or Not Rated.
            </div>
            <div
              style={{ cursor: 'pointer' }}
              className="ImportTemplateString"
              onClick={() => exportEmptyTemplate()}
            >
              Download an empty template here
            </div>
            <div
              style={{ cursor: 'pointer' }}
              className="FileImport"
              onClick={() => importMovieListCsv()}
            >
              <Stack alignItems="center" direction="row" gap={2}>
                File to Import: {importFile ? importFile : 'Select File to Import'}
                <Folder />
              </Stack>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className="ImportSubmit"
            onClick={handleImport}
            variant="contained"
            disabled={!importFile}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
