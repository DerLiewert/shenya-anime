import { configureStore } from '@reduxjs/toolkit';
import introAnimeSlice from '../store/anime/introAnimeSlice';
import randomAnimeSlice from '../store/anime/randomAnimeSlice';
import seasonalAnimeSlice from '../store/anime/seasonalAnimeSlice';
import todaySchedulesAnimeSlice from '../store/anime/todaySchedulesAnimeSlice';
import animeFullByIdSlice from '@/store/anime/animeFullByIdSlice';
import animeCatalogSlice from '@/store/anime/animeCatalogSlice';
import animeGenresSlice from '@/store/anime/animeGenresSlice';
import mangaFullByIdSlice from '@/store/manga/mangaFullByIdSlice';

export const store = configureStore({
  reducer: {
    introAnime: introAnimeSlice,
    todaySchedulesAnime: todaySchedulesAnimeSlice,
    seasonalAnime: seasonalAnimeSlice,
    randomAnime: randomAnimeSlice,
    animeFullById: animeFullByIdSlice,
    animeCatalog: animeCatalogSlice,
    animeGenres: animeGenresSlice,

    mangaFullById: mangaFullByIdSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
