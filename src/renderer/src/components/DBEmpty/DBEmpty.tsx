import './DBEmpty.css';
import { Link } from 'react-router-dom';

export function DBEmpty() {
  return (
    <div>
      <div className="HomeLineItem">Movie Database Is Currently Empty</div>
      <div className="HomeLineItem">
        <Link className="HomeLink" to="/add">
          Click Here To Add Your First Movie
        </Link>
      </div>
    </div>
  );
}
