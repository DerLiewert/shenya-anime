import { getResource } from '@/api/client/api.client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FetchStatus } from '@/typescript';
import { Anime } from '@/models';
import { weekDays } from '@/constants';

interface TodaySchedulesAnimeState {
  items: Anime[];
  status: FetchStatus | null;
}

const initialState: TodaySchedulesAnimeState = {
  items: [],
  status: null,
};

export const todaySchedulesAnimeSlice = createSlice({
  name: 'today-schedules-anime',
  initialState,
  reducers: {
    setTodaySchedulesAnimeItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodaySchedulesAnime.pending, (state, action) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchTodaySchedulesAnime.fulfilled, (state, action: PayloadAction<Anime[]>) => {
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchTodaySchedulesAnime.rejected, (state, action) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export const fetchTodaySchedulesAnime = createAsyncThunk<Anime[]>(
  'today-schedules-anime/fetchAnimeItems',
  async (_, { signal }) => {
    const weekDayIndex = new Date().getDay();
    const { data } = await getResource<Anime[]>({
      endpoint: `https://api.jikan.moe/v4/schedules`,
      queryParams: {
        filter: weekDays[weekDayIndex],
        // limit: 6,
      },

      // endpoint: 'https://api.jikan.moe/v4/anime',
      // queryParams: { limit: 25, genres: [12], order_by: 'score', sort: 'desc' },
      signal,
    });
    return data;
  },
);

export const { setTodaySchedulesAnimeItems } = todaySchedulesAnimeSlice.actions;

export default todaySchedulesAnimeSlice.reducer;
