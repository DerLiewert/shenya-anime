import { getSeason } from '@/api';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Anime, AnimeSeason, JikanPaginationPlus, JikanResponse } from '../../models';

export const fetchSeasonsAnime = createAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  { year: number; season: AnimeSeason; page?: number | undefined }
>('seasons-anime/fetchAnimeItems', async ({ year, season, page = 1 }, { signal }) => {
  const data = await getSeason({ year, season, page }, signal);
  return data;
});

interface SeasonsAnimeState {
  items: Anime[];
  pagination: JikanPaginationPlus | null;
  season: {
    year: number;
    season: AnimeSeason;
  } | null;
  status: FetchStatus;
}

const initialState: SeasonsAnimeState = {
  items: [],
  pagination: null,
  season: null,
  status: FetchStatus.LOADING,
};

export const seasonsAnimeSlice = createSlice({
  name: 'seasons-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSeasonsAnime.pending, (state, action) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchSeasonsAnime.fulfilled, (state, action) => {
      const { year, season, page = 1 } = action.meta.arg;
      const { data, pagination } = action.payload;

      const isShowMore = page > 1;

      state.items = isShowMore ? [...state.items, ...data] : data;
      state.pagination = pagination ? pagination : null;
      state.season = { year, season };
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchSeasonsAnime.rejected, (state, action) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

// export const {  } = seasonsAnimeSlice.actions;

export default seasonsAnimeSlice.reducer;
