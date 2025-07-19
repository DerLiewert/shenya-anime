import { getAnimeSearch } from '@/api';
import { getResource } from '@/api/api.client';
import { FetchStatus } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Anime, JikanPaginationPlus } from '../../models';
import { randomInteger } from '../../utils';

interface randomAnimeState {
  item: Anime | null;
  minScore: number;
  status: FetchStatus;
}

const initialState: randomAnimeState = {
  item: null,
  minScore: 8,
  status: FetchStatus.LOADING,
};

export const randomAnimeSlice = createSlice({
  name: 'random-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRandomAnime.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchRandomAnime.fulfilled, (state, action) => {
      state.item = action.payload;
      state.status = FetchStatus.SUCCESS;
    });

    builder.addCase(fetchRandomAnime.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

// export const {} = randomAnimeSlice.actions

export default randomAnimeSlice.reducer;

export const fetchRandomAnime = createAsyncThunk<Anime, void, { state: RootState }>(
  'random-anime/fetchRandomAnime',
  async (_, thunkAPI) => {
    const minScore = thunkAPI.getState().randomAnime.minScore;

    // Получаем количество страниц
    const firstResponse = await getAnimeSearch({ min_score: minScore, limit: 1 }, thunkAPI.signal);

    if (!firstResponse.pagination || firstResponse.pagination.last_visible_page === 0) {
      return thunkAPI.rejectWithValue('Pagination data missing or empty');
    }

    const totalPages = firstResponse.pagination.last_visible_page;
    const page = randomInteger(1, totalPages);

    // Получаем случайное аниме с этой страницы
    const pageResponse = await getResource<Anime[], JikanPaginationPlus>({
      endpoint: `https://api.jikan.moe/v4/anime`,
      queryParams: {
        min_score: minScore,
        limit: 1,
        page,
      },
      signal: thunkAPI.signal,
    });

    if (!pageResponse.data.length) {
      return thunkAPI.rejectWithValue('No anime found on selected page');
    }

    return pageResponse.data[0];
  },
);
