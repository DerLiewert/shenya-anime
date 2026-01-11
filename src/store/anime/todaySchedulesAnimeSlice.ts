import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getResource, SchedulesEndpoints } from '@/api';
import { Anime } from '@/typescript';
import { weekDays } from '@/constants';
import { asyncListBaseBuilder, createAsyncListBaseState } from '../_common';

//============ Thunk ============//
export const fetchTodaySchedulesAnime = createAppAsyncThunk<Anime[]>(
  'today-schedules-anime/fetchAnimeItems',
  async (_, { signal }) => {
    const weekDayIndex = new Date().getDay();
    const { data } = await getResource<Anime[]>({
      endpoint: SchedulesEndpoints.schedules,
      queryParams: {
        filter: weekDays[weekDayIndex],
        // limit: 6,
      },
      signal,
    });
    return data;
  },
);

//============ Slice ============//
const initialState = createAsyncListBaseState<Anime>();

export const todaySchedulesAnimeSlice = createSlice({
  name: 'today-schedules-anime',
  initialState,
  reducers: {
    setTodaySchedulesAnimeItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    asyncListBaseBuilder(builder, fetchTodaySchedulesAnime);
  },
});

export const { setTodaySchedulesAnimeItems } = todaySchedulesAnimeSlice.actions;

export default todaySchedulesAnimeSlice.reducer;
