import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header, Footer } from './components';
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

function App() {
  return (
    <div className="wrapper">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime" element={<AnimeCatalogPage />} />
          <Route path="/manga" element={<MangaCatalogPage />} />
          <Route path="/anime/:id/*" element={<FullAnimePage />} />
          <Route path="/manga/:id/*" element={<FullMangaPage />} />
          <Route path="/character/:id/*" element={<CharacterPage />} />
          <Route path="/people/:id/*" element={<PersonPage />} />
          <Route path="/schedules/*" element={<Schedules />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
