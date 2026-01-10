import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getResource, TopEndpoints } from '@/api';
import { Manga } from '@/typescript';
import { asyncListBaseBuilder, createAsyncListBaseState } from '../_common';

const initialState = createAsyncListBaseState<Manga>();

export const mangaTopSlice = createSlice({
  name: 'top-manga',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncListBaseBuilder(builder, fetchTopManga);
  },
});

export default mangaTopSlice.reducer;

export const fetchTopManga = createAppAsyncThunk<Manga[]>(
  'top-manga/fetchTopManga',
  async (_, { signal }) => {
    const { data } = await getResource<Manga[]>({
      endpoint: TopEndpoints.topManga,
      queryParams: { limit: 10 },
      signal,
    });
    return data;
  },
);
