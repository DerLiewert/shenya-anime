import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getMangaGenres } from '@/api';
import { Genre } from '@/typescript';
import { asyncGenresBuilder, createAsyncGenresState } from '../_common';

//============ Thunk ============//
export const fetchMangaGenres = createAppAsyncThunk<Genre[]>(
  'manga-genres/fetchGenres',
  async () => (await getMangaGenres()).data,
);

//============ Slice ============//
const initialState = createAsyncGenresState();

export const mangaGenresSlice = createSlice({
  name: 'manga-genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncGenresBuilder(builder, fetchMangaGenres);
  },
});

export default mangaGenresSlice.reducer;
