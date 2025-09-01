import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  return (
    <div className="wrapper">
      <Header setIsSearchOpen={setIsSearchOpen}/>
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/anime" element={<AnimeCatalogPage />} />
          <Route path="/anime/:id/*" element={<FullAnimePage />} />

          <Route path="/manga" element={<MangaCatalogPage />} />
          <Route path="/manga/:id/*" element={<FullMangaPage />} />

          <Route path="/character/:id/*" element={<CharacterPage />} />
          <Route path="/people/:id/*" element={<PersonPage />} />

          <Route path="/schedules/*" element={<Schedules />} />
          {/* <Route path="/schedules" element={<Schedules />}>
            <Route index element={<Broadcast />} />
            <Route path="broadcast" element={<Broadcast />} />
            <Route path="seasonal" element={<Seasonal />} />
          </Route> */}

          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      {isSearchOpen && <Search setIsSearchOpen={setIsSearchOpen}/>}
    </div>
  );
}

export default App;
