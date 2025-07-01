import { Link } from 'react-router-dom';
import './GreenBox.css'

function GreenBox({ to, children, className = '' }) {
  const classes = `greencontainer ${className}`;

  return to ? (
    <Link to={to} className={classes}>
      {children}
    </Link>
  ) : (
    <div className={classes}>
      {children}
    </div>
  );
}

export default GreenBox;
