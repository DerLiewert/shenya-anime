import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getAnimeGenres } from '@/api';
import { Genre } from '@/typescript';
import { asyncGenresBuilder, createAsyncGenresState } from '../_common';

//============ Thunk ============//
export const fetchAnimeGenres = createAppAsyncThunk<Genre[]>(
  'anime-genres/fetchGenres',
  async () => (await getAnimeGenres()).data,
);

//============ Slice ============//
const initialState = createAsyncGenresState();

export const animeGenresSlice = createSlice({
  name: 'anime-genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncGenresBuilder(builder, fetchAnimeGenres);
  },
});

export default animeGenresSlice.reducer;
