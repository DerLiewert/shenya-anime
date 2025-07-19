import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Footer } from './components/Layout/Footer';
import {
  FullAnimePage,
  FullMangaPage,
  HomePage,
  CharacterPage,
  NotFoundPage,
  PersonPage,
  AnimeCatalogPage,
  MangaCatalogPage,
} from './pages';

// useEffect(() => {
//   const controller = new AbortController();
//   dispatch(fetchFullAnimeById(id, { signal: controller.signal }));

//   return () => {
//     controller.abort(); // отменяем при переходе
//   };
// }, [id]);

function App() {
  React.useEffect(() => {
    // const test = async () => {
    //   const ids = [
    //     52991, 5114, 9253, 38524, 28977, 60022, 39486, 11061, 9969, 15417, 820, 41467, 34096, 43608,
    //     42938, 4181, 918, 28851, 35180, 2904, 15335, 19, 37491, 54492, 51535,
    //   ];
    //   for (let i = 0; i < 10; i++) {
    //     const id = ids[i];
    //     const config: AxiosRequestConfig = {
    //       method: 'get',
    //       url: `https://api.jikan.moe/v4/anime/${id}`,
    //     };
    //     console.log('test', (await limitedAxios(config)).data);
    //   }
    // };
    //  test()
  }, []);
  return (
    <div className="wrapper">
      {/* <Header /> */}
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime" element={<AnimeCatalogPage />} />
          <Route path="/manga" element={<MangaCatalogPage />} />
          <Route path="/anime/:id/*" element={<FullAnimePage />} />
          <Route path="/manga/:id/*" element={<FullMangaPage />} />
          <Route path="/character/:id/*" element={<CharacterPage />} />
          <Route path="/people/:id/*" element={<PersonPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
