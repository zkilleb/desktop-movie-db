import { TableCell, TableRow } from '@mui/material';
import './EmptyDBTableRow.css';
import { Link } from 'react-router-dom';

export function EmptyDBTableRow({ colSpan, cellText }: { colSpan: number; cellText: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="EmptyMovieList">{cellText}</div>
        <Link to="/add" className="EmptyMovieList">
          Click Here To Add One
        </Link>
      </TableCell>
    </TableRow>
  );
}
