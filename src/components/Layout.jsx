import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css'

const menuItems = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  { name: 'WORK', path: '/work' },
  { name: 'BLOG', path: '/blog' },
  { name: 'CONTACT', path: '/contact' },
];

function Layout() {

  const [topbox, setTopbox] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const current = menuItems.find(item => item.path === location.pathname) || menuItems[0];

  return (
    <div className="layout">
      <header className="artistheader">
        <h1 className="artistheading">Hannah Myers</h1>
        <h2 className="artistbanner">ARTIST</h2>
      </header>

      <nav className="nav desktop-menu">
        <ul>
          {menuItems.map(item => (
            <li key={item.path}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
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
      </footer>
    </div>
  );
}

export default Layout;
