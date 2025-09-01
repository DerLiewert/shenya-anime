import { configureStore } from '@reduxjs/toolkit';
import introAnimeSlice from '../store/anime/introAnimeSlice';
import randomAnimeSlice from '../store/anime/randomAnimeSlice';
import seasonalAnimeSlice from '../store/anime/seasonalAnimeSlice';
import todaySchedulesAnimeSlice from '../store/anime/todaySchedulesAnimeSlice';
import animeFullByIdSlice from '@/store/anime/animeFullByIdSlice';
import animeCatalogSlice from '@/store/anime/animeCatalogSlice';
import animeGenresSlice from '@/store/genres/animeGenresSlice';
import mangaFullByIdSlice from '@/store/manga/mangaFullByIdSlice';
import characterFullByIdSlice from '@/store/character/characterFullByIdSlice';
import personFullByIdSlice from '@/store/person/personFullByIdSlice';
import mangaCatalogSlice from '@/store/manga/mangaCatalogSlice';
import mangaGenresSlice from '@/store/genres/mangaGenresSlice';
import schedulesAnimeSlice from '@/store/anime/schedulesAnimeSlice';
import seasonsListSlice from '@/store/season/seasonListSlice';
import seasonsAnimeSlice from '@/store/season/seasonsAnimeSlice';
import mangaTopSlice from '@/store/manga/mangaTopSlice';
import searchSlice from '@/store/search/searchSlice';

export const store = configureStore({
  reducer: {
    introAnime: introAnimeSlice,
    todaySchedulesAnime: todaySchedulesAnimeSlice,
    seasonalAnime: seasonalAnimeSlice,
    randomAnime: randomAnimeSlice,
    animeFullById: animeFullByIdSlice,
    animeCatalog: animeCatalogSlice,
    animeGenres: animeGenresSlice,

    schedulesAnime: schedulesAnimeSlice,
    seasonsList: seasonsListSlice,
    seasonsAnime: seasonsAnimeSlice,

    mangaTop: mangaTopSlice,
    mangaFullById: mangaFullByIdSlice,
    mangaCatalog: mangaCatalogSlice,
    mangaGenres: mangaGenresSlice,

    characterFullById: characterFullByIdSlice,
    personFullById: personFullByIdSlice,
    
    search: searchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
