import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header, Footer, Broadcast, Seasonal, Search } from './components';
import {
  FullAnimePage,
  FullMangaPage,
  HomePage,
  CharacterPage,
  NotFoundPage,
  PersonPage,
  AnimeCatalogPage,
  MangaCatalogPage,
  Schedules,
} from './pages';

// Ленивый импорт
// const NewsTab = lazy(() => import('./tabs/NewsTab'));
// const VideosTab = lazy(() => import('./tabs/VideosTab'));

function App() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="wrapper">
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/anime" element={<AnimeCatalogPage />} />
          <Route path="/anime/:id/*" element={<FullAnimePage />} />

          <Route path="/manga" element={<MangaCatalogPage />} />
          <Route path="/manga/:id/*" element={<FullMangaPage />} />

          <Route path="/character/:id/*" element={<CharacterPage />} />
          <Route path="/people/:id/*" element={<PersonPage />} />
          <Route path="/producer/:id/*" element={<>Producer </>} />

          <Route path="/schedules/*" element={<Schedules />} />

          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      {isSearchOpen && <Search onSearchClose={() => setIsSearchOpen(false)} />}
    </div>
  );
}

export default App;
