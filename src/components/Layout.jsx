import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Layout.css'

function Layout() {

  const [topbox, setTopbox] = useState(null);

    return (
    <div className="layout">
      <header className="artistheader">
        <h1 className="artistheading">Hannah Myers</h1>
        <h2 className="artistbanner">ARTIST</h2>
      </header>

      <nav className="nav">
        <ul>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/work">WORK</Link></li>
          <li><Link to="/blog">BLOG</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
        </ul>
      </nav>

      <div className="topbox">
        {topbox}
      </div>

      <main>
        <div className="contentbox">
          <Outlet context={{ setTopbox }} />
        </div>
      </main>

      <footer className="footer">
        <p>&copy; Hannah Myers</p>
        <a href="/admin" target="_blank" rel="noopener noreferrer">Admin</a>
      </footer>
    </div>
  );
}

export default Layout;
