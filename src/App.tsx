import React from 'react';
import { Route, Routes, ScrollRestoration, useLocation } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { Header, Footer, Search } from './components';
import {
  FullAnimePage,
  FullMangaPage,
  HomePage,
  CharacterPage,
  NotFound,
  PersonPage,
  AnimeCatalogPage,
  MangaCatalogPage,
  Schedules,
  ProducerPage,
  Bookmark,
} from './pages';

// Ленивый импорт
// const NewsTab = lazy(() => import('./tabs/NewsTab'));
// const VideosTab = lazy(() => import('./tabs/VideosTab'));

import { useEffect, useRef } from 'react';
import { useNavigationType } from 'react-router-dom';

const ScrollManager = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // POP / PUSH / REPLACE
  const positions = useRef(new Map());

  // сохранить позицию при уходе со страницы
  useEffect(() => {
    return () => {
      positions.current.set(pathname, window.scrollY);
    };
  }, [pathname]);

  useEffect(() => {
    const noScrollPatterns = [
      /^\/anime\/[^/]+/, // Страницы с табами — не скроллить вверх
      /^\/manga\/[^/]+/,
      /^\/schedules\/[^/]+/,
    ];

    const isTabNavigation = noScrollPatterns.some((re) => re.test(pathname));

    if (navType === 'POP') {
      // Назад/вперёд — восстанавливаем скролл
      const saved = positions.current.get(pathname);
      if (saved != null) {
        window.scrollTo(0, saved);
        return;
      }
    }

    if (!isTabNavigation) {
      // Обычно — скролл вверх
      window.scrollTo(0, 0);
    }

    // Если табы — просто не трогаем скролл
  }, [pathname, navType]);

  return null;
};

function App() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const isScrollToTop = useAppSelector((state) => state.settings.scrollToTop);
  const bodyLock = useAppSelector((state) => state.settings.bodyLock);

  // React.useEffect(() => {
  //   console.log(isScrollToTop);

  //   if (isScrollToTop) window.scrollTo({ top: 0 });
  // }, [location.pathname, isScrollToTop]);

  React.useEffect(() => {
    if (bodyLock) {
      document.body.classList.add('_lock');
    } else {
      document.body.classList.remove('_lock');
    }
  }, [bodyLock]);

  return (
    <>
      <div className="wrapper">
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        <main className="main">
          <ScrollManager />
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/anime" element={<AnimeCatalogPage />} />
            <Route path="/anime/:id/*" element={<FullAnimePage />} />

            <Route path="/manga" element={<MangaCatalogPage />} />
            <Route path="/manga/:id/*" element={<FullMangaPage />} />

            <Route path="/character/:id/*" element={<CharacterPage />} />
            <Route path="/people/:id/*" element={<PersonPage />} />
            <Route path="/producer/:id/*" element={<ProducerPage />} />

            <Route path="/schedules/*" element={<Schedules />} />

            <Route path="/bookmark/*" element={<Bookmark />} />

            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        {isSearchOpen && <Search onSearchClose={() => setIsSearchOpen(false)} />}
      </div>
    </>
  );
}

export default App;
