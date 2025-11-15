import { getAnimeSearch } from '@/api';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { Anime } from '@/models';
import { randomInteger } from '@/utils';

interface randomAnimeState {
  item: Anime | null;
  status: FetchStatus | null;
}

const initialState: randomAnimeState = {
  item: null,
  status: null,
};

export const randomAnimeSlice = createSlice({
  name: 'random-anime',
  initialState,
  reducers: {
    clearRandomAnimeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRandomAnime.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchRandomAnime.fulfilled, (state, action) => {
      state.item = action.payload;
      state.status = FetchStatus.SUCCESS;
    });

    builder.addCase(fetchRandomAnime.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.status = FetchStatus.ERROR;
    });
  },
});

export const { clearRandomAnimeState } = randomAnimeSlice.actions;

export default randomAnimeSlice.reducer;

export const fetchRandomAnime = createAsyncThunk<Anime, void, { state: RootState }>(
  'random-anime/fetchRandomAnime',
  async (_, thunkAPI) => {
    const minScore = 8;

    // Получаем количество страниц
    const firstResponse = await getAnimeSearch({ min_score: minScore, limit: 1 }, thunkAPI.signal);

    if (!firstResponse.pagination || firstResponse.pagination.last_visible_page === 0) {
      return thunkAPI.rejectWithValue('Pagination data missing or empty');
    }

    const totalPages = firstResponse.pagination.last_visible_page;
    const page = randomInteger(1, totalPages);

    const pageResponse = await getAnimeSearch(
      {
        min_score: minScore,
        limit: 1,
        page,
      },
      thunkAPI.signal,
    );

    if (!pageResponse.data.length) {
      return thunkAPI.rejectWithValue('No anime found on selected page');
    }

    return pageResponse.data[0];
  },
);
