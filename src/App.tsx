import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { Header, Footer, Search, AppLayout } from './components';
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

function App() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const bodyLock = useAppSelector((state) => state.settings.bodyLock);

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
          <Routes>
            <Route element={<AppLayout />}>
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
            </Route>
          </Routes>
        </main>
        <Footer />
        {isSearchOpen && <Search onSearchClose={() => setIsSearchOpen(false)} />}
      </div>
    </>
  );
}

export default App;
