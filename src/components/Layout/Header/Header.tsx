import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMatchMedia } from '@/hooks';
import { SearchIcon } from '@/components';
import { commonPaths, MEDIA_QUERY } from '@/variables';
import logo from '@/assets/logo.svg';
import clsx from 'clsx';
import './Header.scss';

const links = [
  { path: commonPaths.home, label: 'Home' },
  { path: commonPaths.anime, label: 'Anime' },
  { path: commonPaths.manga, label: 'Manga' },
  { path: commonPaths.schedules, label: 'Schedules' },
];

const Header: React.FC<{ onSearchOpen: () => void }> = ({ onSearchOpen }) => {
  const location = useLocation();
  const currentPage = links.findIndex(
    (link) => location.pathname === link.path || location.pathname.startsWith(link.path + '/'),
  );
  const activeLink = currentPage >= 0 ? currentPage : undefined;

  const isTablet = useMatchMedia('max', MEDIA_QUERY.tablet);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isTablet && isMenuOpen) setIsMenuOpen(false);
  }, [isTablet, isMenuOpen]);

  React.useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__body">
          <Link to="/" className="logo">
            <img src={logo} alt="Shenya anime logo" />
          </Link>
          <div className="menu">
            <nav className="menu__body">
              <ul className="menu__list">
                {links.map((link, index) => (
                  <li className="menu__item" key={link.label}>
                    <Link
                      to={link.path}
                      className={clsx('menu__link', {
                        _active: activeLink === index,
                      })}
                      onClick={() => setIsMenuOpen(false)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="actions">
            <button className="search-btn" aria-label="Search" onClick={onSearchOpen}>
              <SearchIcon />
            </button>
            <button
              className="burger"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
