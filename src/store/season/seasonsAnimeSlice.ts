import { getSeason } from '@/api';
import { createSlice } from '@reduxjs/toolkit';
import { Anime, AnimeSeasons, JikanPaginationPlus, JikanResponse } from '@/typescript';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { asyncListFullBuilder, createAsyncListFullState, FetchListArgs } from '../_common';

const initialState = createAsyncListFullState<Anime, JikanPaginationPlus>();

export const seasonsAnimeSlice = createSlice({
  name: 'seasons-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncListFullBuilder(builder, fetchSeasonsAnime);
  },
});

// export const {  } = seasonsAnimeSlice.actions;
export default seasonsAnimeSlice.reducer;

//========================================================================================================================================================
export const fetchSeasonsAnime = createAppAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  FetchListArgs<{ year: number; season: AnimeSeasons; page?: number; limit?: number }>
>(
  'seasons-anime/fetchAnimeItems',
  async ({ params: { year, season, page = 1, limit = 24 } }, { signal }) =>
    await getSeason({ year, season, queryParams: { page, limit } }, signal),
);
