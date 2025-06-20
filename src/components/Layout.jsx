import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Layout() {
  return (
    <>
      <header className="artistheader">
        <h1 className="artistheading">Hannah Myers</h1>
        <h2 className="artistbanner">ARTIST</h2>
      </header>

      <nav className="navdesktop">
        <ul>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/work">WORK</Link></li>
          <li><Link to="/blog">BLOG</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; Hannah Myers</p>
      </footer>
    </>
  );
}

export default Layout;
