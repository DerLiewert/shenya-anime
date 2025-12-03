import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useMatchMedia } from '@/hooks';
import { BookmarkIcon, SearchIcon, SfwOffIcon, SfwOnIcon } from '@/components';
import { breakpoints } from '@/constants';
import { appPaths } from '@/resources';
import { toggleSfw } from '@/store';
import logo from '@/assets/logo.svg';
import clsx from 'clsx';
import './Header.scss';
import { scrollToTop } from '@/utils';

const links = [
  { path: appPaths.home, label: 'Home' },
  { path: appPaths.anime, label: 'Anime' },
  { path: appPaths.manga, label: 'Manga' },
  { path: appPaths.schedules, label: 'Schedules' },
] as const;

const Header: React.FC<{ onSearchOpen: () => void }> = ({ onSearchOpen }) => {
  const headerRef = React.useRef<HTMLElement>(null);
  const location = useLocation();
  const activeLink = links.findIndex(
    (link) => location.pathname === link.path || location.pathname.startsWith(link.path + '/'),
  );

  const isTablet = useMatchMedia('max', breakpoints.tablet);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isTablet && isMenuOpen) setIsMenuOpen(false);
  }, [isTablet, isMenuOpen]);

  React.useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    if (isMenuOpen) scrollToTop(headerRef);

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  React.useEffect(() => {
    if (isMenuOpen) document.body.classList.remove('menu-open');
  }, [location]);

  React.useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const resizeObserver = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        '--header-height',
        (header ? header.clientHeight : 0) + 'px',
      );
    });
    resizeObserver.observe(header);

    return () => resizeObserver.disconnect();
  }, [headerRef.current]);

  return (
    <header className="header" ref={headerRef}>
      <div className="header__container container">
        <div className="header__body">
          <Link to={appPaths.home} className="header__logo">
            <img src={logo} alt="Shenya anime logo" />
          </Link>

          {/* === menu === */}
          <div className="header__menu menu">
            <nav className="menu__body">
              <ul className="menu__list">
                {links.map((link, index) => (
                  <li className="menu__item" key={link.label}>
                    <Link
                      to={link.path}
                      className={clsx('menu__link', {
                        _active: activeLink === index,
                      })}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* === actions === */}
          <div className="header__actions">
            <SfwBtn />
            <button className="header__action-btn" aria-label="Search" onClick={onSearchOpen}>
              <SearchIcon />
            </button>
            <Link className="header__action-btn" to={appPaths.bookmark}>
              <BookmarkIcon />
            </Link>
            <button
              className="header__burger burger"
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

const SfwBtn = () => {
  const dispatch = useAppDispatch();
  const sfw = useAppSelector((state) => state.settings.sfw);
  return (
    <button
      className="header__sfw-btn"
      onClick={() => dispatch(toggleSfw())}
      aria-label={sfw ? 'Adult content allowed' : 'Adult content blocked'}>
      {sfw ? <SfwOnIcon /> : <SfwOffIcon />}
    </button>
  );
};
