import { SchedulesEndpoints } from '@/api';
import { getResource } from '@/api/client/api.client';
import { AsyncThunkConfig, FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Anime, JikanPaginationPlus, JikanResponse, SchedulesFilter } from '../../models';

interface SchedulesAnimeState {
  items: Anime[];
  filter: SchedulesFilter | null;
  pagination: JikanPaginationPlus | null;
  status: FetchStatus | null;
}

const initialState: SchedulesAnimeState = {
  items: [],
  filter: null,
  pagination: null,
  status: null,
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
      const { data, pagination } = action.payload;
      state.items = data ? data : [];
      state.pagination = pagination ? pagination : null;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchSchedulesAnime.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.status = FetchStatus.ERROR;
    });
  },
});

export const fetchSchedulesAnime = createAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  { filter: SchedulesFilter; page?: number },
  AsyncThunkConfig
>('schedules-anime/fetchAnimeItems', async ({ page, filter }, { signal }) => {
  const data = await getResource<Anime[], JikanPaginationPlus>({
    endpoint: SchedulesEndpoints.schedules,
    queryParams: {
      filter,
      page,
      limit: 24,
    },
    signal,
  });
  return data;
});

// export const {  } = schedulesAnimeSlice.actions;

export default schedulesAnimeSlice.reducer;
