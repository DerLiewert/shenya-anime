import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon } from '@/components';
import logo from '@/assets/logo.svg';
import './Header.scss';
import clsx from 'clsx';
import { useMatchMedia } from '@/hooks';
import { MEDIA_QUERY } from '@/variables';

const links = [
  { path: '/', label: 'Home' },
  { path: '/anime', label: 'Anime' },
  { path: '/manga', label: 'Manga' },
  { path: '/schedules', label: 'Schedules' },
];

const Header: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const currentPage: number =
    segments.length > 0 ? links.findIndex((link) => segments.includes(link.path.slice(1))) : 0;

  const activeLink = React.useMemo(
    () => (currentPage >= 0 ? currentPage : undefined),
    [currentPage],
  );

  const isTablet = useMatchMedia('max', MEDIA_QUERY.tablet);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isTablet && isMenuOpen) setIsMenuOpen(false);
  }, [isTablet]);

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
            <button className="search" aria-label="Search">
              <SearchIcon />
            </button>
            <button
              className="burger"
              aria-label="menu"
              aria-expanded="false"
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
