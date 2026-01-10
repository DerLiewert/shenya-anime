import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getAnimeSearch } from '@/api';
import { Anime, AnimeSearchParams, JikanPaginationPlus, JikanResponse } from '@/typescript';
import { createAsyncListFullState, asyncListFullBuilder, FetchListArgs } from '../_common';

const initialState = createAsyncListFullState<Anime, JikanPaginationPlus>();

const animeCatalogSlice = createSlice({
  name: 'anime-catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncListFullBuilder(builder, fetchAnimeByParams);
  },
});

export default animeCatalogSlice.reducer;

//========================================================================================================================================================
export const fetchAnimeByParams = createAppAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  FetchListArgs<AnimeSearchParams>
>('anime-catalog/fetchAnimeByParams', async ({ params }, { signal }) =>
  getAnimeSearch({ limit: 24, ...params }, signal),
);
