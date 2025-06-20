import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Hannah</Link></li>
        <li><Link to="/work">Work</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {/* Add more as needed */}
      </ul>
    </nav>
  );
}

export default Navbar;
