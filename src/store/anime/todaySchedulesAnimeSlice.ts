import { getResource } from '@/api/api.client';
import { FetchStatus } from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Anime } from '../../models';
import { WEEK_DAYS } from '../../variables';

interface TodaySchedulesAnimeState {
  items: Anime[];
  status: FetchStatus;
}

const initialState: TodaySchedulesAnimeState = {
  items: [],
  status: FetchStatus.LOADING,
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
    // const { data } = await axios.get<JikanResponse<Anime[]>>(
    //   `https://api.jikan.moe/v4/schedules?filter=${WEEK_DAYS[weekDayIndex]}&limit=6`,
    // );

    const { data } = await getResource<Anime[]>({
      endpoint: `https://api.jikan.moe/v4/schedules`,
      queryParams: {
        filter: WEEK_DAYS[weekDayIndex],
        // limit: 6,
      },
      signal,
    });
    return data;
  },
);

export const { setTodaySchedulesAnimeItems } = todaySchedulesAnimeSlice.actions;

export default todaySchedulesAnimeSlice.reducer;
