import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getResource, SeasonsEndpoints } from '@/api/';
import { Anime } from '@/typescript';
import { asyncListBaseBuilder, createAsyncListBaseState } from '../_common';

//============ Slice ============//
const initialState = createAsyncListBaseState<Anime>();

export const seasonalAnimeSlice = createSlice({
  name: 'seasonal-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncListBaseBuilder(builder, fetchSeasonalAnime);
  },
});

export default seasonalAnimeSlice.reducer;

//============ Thunk ============//
export const fetchSeasonalAnime = createAppAsyncThunk<Anime[]>(
  'seasonal-anime/fetchAnimeItems',
  async (_, { signal }) => {
    const { data } = await getResource<Anime[]>({
      endpoint: SeasonsEndpoints.seasonNow,
      signal,
    });
    return data;
  },
);
