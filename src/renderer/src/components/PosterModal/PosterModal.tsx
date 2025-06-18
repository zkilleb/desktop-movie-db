import { Close } from '@mui/icons-material';
import './PosterModal.css';
import { Dialog, DialogContent } from '@mui/material';

export function PosterModal({
  open,
  handleClose,
  posterPath,
  title
}: {
  open: boolean;
  handleClose: () => void;
  posterPath: string;
  title: string;
}) {
  return (
    <Dialog onClose={handleClose} open={open}>
      <div onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
        <Close />
      </div>
      <DialogContent>
        <img
          className="SearchResultPoster"
          src={`https://image.tmdb.org/t/p/original${posterPath}`}
          alt={`${title} poster`}
          width="320.1"
          height="480"
        />
      </DialogContent>
    </Dialog>
  );
}
