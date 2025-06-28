import React from 'react';
import clsx from 'clsx';

import logo from '@/assets/logo.svg';

import styles from './Header.module.scss';
import { SearchIcon } from '../../Icons';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__body}>
          <Link to="#" className={styles.logo}>
            <img src={logo} alt="Shenya anime logo" />
          </Link>
          <div className={styles.menu}>
            <nav className={styles.menu__body}>
              <ul className={styles.menu__list}>
                <li className={styles.menu__item}>
                  <Link to="#" className={clsx(styles.menu__link, styles._active)}>
                    Home
                  </Link>
                </li>
                <li className={styles.menu__item}>
                  <Link to="#" className={styles.menu__link}>
                    Anime
                  </Link>
                </li>
                <li className={styles.menu__item}>
                  <Link to="#" className={styles.menu__link}>
                    Manga
                  </Link>
                </li>
                <li className={styles.menu__item}>
                  <Link to="#" className={styles.menu__link}>
                    Schedules
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className={styles.actions}>
            <button className={styles.search} aria-label="Search">
              <SearchIcon />
            </button>
            <button className={styles.burger} aria-label="Search" aria-expanded="false">
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
