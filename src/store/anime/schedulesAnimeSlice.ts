import { SchedulesEndpoints } from '@/api';
import { getResource } from '@/api/api.client';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Anime, JikanPaginationPlus, JikanResponse, SchedulesFilter } from '../../models';

interface SchedulesAnimeState {
  items: Anime[];
  day: SchedulesFilter | null;
  pagination: JikanPaginationPlus | null;
  status: FetchStatus;
}

const initialState: SchedulesAnimeState = {
  items: [],
  day: null,
  pagination: null,
  status: FetchStatus.LOADING,
};

export const schedulesAnimeSlice = createSlice({
  name: 'schedules-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSchedulesAnime.pending, (state, action) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchSchedulesAnime.fulfilled, (state, action) => {
      const { day, page = 1 } = action.meta.arg;
      const { data, pagination } = action.payload;

      const isShowMore = page > 1;

      state.day = day;
      state.items = isShowMore ? [...state.items, ...data] : data;
      state.pagination = pagination ? pagination : null;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchSchedulesAnime.rejected, (state, action) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export const fetchSchedulesAnime = createAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  { day: SchedulesFilter; page?: number }
>('schedules-anime/fetchAnimeItems', async ({ page, day }, { signal }) => {
  const data = await getResource<Anime[], JikanPaginationPlus>({
    endpoint: SchedulesEndpoints.schedules,
    queryParams: {
      filter: day,
      page,
    },
    signal,
  });
  return data;
});

// export const {  } = schedulesAnimeSlice.actions;

export default schedulesAnimeSlice.reducer;
