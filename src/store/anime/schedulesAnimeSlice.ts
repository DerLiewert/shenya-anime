import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { SchedulesEndpoints, getResource } from '@/api';
import { Anime, JikanPaginationPlus, JikanResponse, SchedulesParams } from '@/typescript';
import { asyncListFullBuilder, createAsyncListFullState, FetchListArgs } from '../_common';

//============ Slice ============//
const initialState = createAsyncListFullState<Anime, JikanPaginationPlus>();

export const schedulesAnimeSlice = createSlice({
  name: 'schedules-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncListFullBuilder(builder, fetchSchedulesAnime);
  },
});

//============ Thunk ============//
export const fetchSchedulesAnime = createAppAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  FetchListArgs<SchedulesParams>
>('schedules-anime/fetchAnimeItems', async ({ params }, { signal }) => {
  const data = await getResource<Anime[], JikanPaginationPlus>({
    endpoint: SchedulesEndpoints.schedules,
    queryParams: {
      ...params,
    },
    signal,
  });
  return data;
});

export default schedulesAnimeSlice.reducer;
