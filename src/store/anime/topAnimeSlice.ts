import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getResource, TopEndpoints } from '@/api';
import { Anime } from '@/typescript';
import { asyncListBaseBuilder, createAsyncListBaseState } from '../_common';

//============ Slice ============//
const initialState = createAsyncListBaseState<Anime>();

export const topAnimeSlice = createSlice({
  name: 'top-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncListBaseBuilder(builder, fetchIntroAnime);
  },
});

export default topAnimeSlice.reducer;

//============ Thunk ============//
export const fetchIntroAnime = createAppAsyncThunk<Anime[]>(
  'intro-anime/fetchAnimeItems',
  async (_, { signal }) => {
    const { data } = await getResource<Anime[]>({
      endpoint: TopEndpoints.topAnime,
      queryParams: { limit: 25 },
      signal,
    });
    return data;
  },
);
