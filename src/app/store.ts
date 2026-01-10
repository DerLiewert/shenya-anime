import { configureStore } from '@reduxjs/toolkit';
import {
  animeCatalogReducer,
  animeFullByIdReducer,
  animeGenresReducer,
  bookmarkReducer,
  characterFullByIdReducer,
  topAnimeReducer,
  mangaCatalogReducer,
  mangaFullByIdReducer,
  mangaGenresReducer,
  mangaTopReducer,
  personFullByIdReducer,
  producerFullByIdReducer,
  randomAnimeReducer,
  schedulesAnimeReducer,
  searchReducer,
  seasonalAnimeReducer,
  seasonListReducer,
  seasonsAnimeReducer,
  settingsReducer,
  todaySchedulesAnimeReducer,
} from '@/store';

export const store = configureStore({
  reducer: {
    topAnime: topAnimeReducer,
    todaySchedulesAnime: todaySchedulesAnimeReducer,
    seasonalAnime: seasonalAnimeReducer,
    randomAnime: randomAnimeReducer,
    animeFullById: animeFullByIdReducer,
    animeCatalog: animeCatalogReducer,
    animeGenres: animeGenresReducer,

    schedulesAnime: schedulesAnimeReducer,
    seasonsList: seasonListReducer,
    seasonsAnime: seasonsAnimeReducer,

    mangaTop: mangaTopReducer,
    mangaFullById: mangaFullByIdReducer,
    mangaCatalog: mangaCatalogReducer,
    mangaGenres: mangaGenresReducer,

    characterFullById: characterFullByIdReducer,
    personFullById: personFullByIdReducer,
    producerFullById: producerFullByIdReducer,

    bookmark: bookmarkReducer,
    search: searchReducer,

    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//======================= Save to localStorage ==============================//
let previousBookmark = store.getState().bookmark;

store.subscribe(() => {
  const currentBookmark = store.getState().bookmark;

  if (currentBookmark !== previousBookmark) {
    previousBookmark = currentBookmark;
    localStorage.setItem('bookmark', JSON.stringify(currentBookmark));
  }
});
