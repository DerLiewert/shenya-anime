import { getAnimeSearch } from '@/api';
import { FetchStatus } from '@/typescript';
import { createSlice } from '@reduxjs/toolkit';
import { Anime } from '@/typescript';
import { randomInteger } from '@/utils';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import {
  handleAsyncFulfilledItem,
  handleAsyncPending,
  handleAsyncRejected,
} from '../_common/common.helper';

interface randomAnimeState {
  item: Anime | null;
  status: FetchStatus | null;
  prevStatus: FetchStatus | null;
}

const initialState: randomAnimeState = {
  item: null,
  status: null,
  prevStatus: null,
};

export const randomAnimeSlice = createSlice({
  name: 'random-anime',
  initialState,
  reducers: {
    clearRandomAnimeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRandomAnime.pending, handleAsyncPending);
    builder.addCase(fetchRandomAnime.fulfilled, handleAsyncFulfilledItem);
    builder.addCase(fetchRandomAnime.rejected, handleAsyncRejected);
  },
});

export const { clearRandomAnimeState } = randomAnimeSlice.actions;

export default randomAnimeSlice.reducer;

//========================================================================================================================================================
export const fetchRandomAnime = createAppAsyncThunk<Anime, number>(
  'random-anime/fetchRandomAnime',
  async (minScore = 8, thunkAPI) => {
    // Получаем количество страниц
    const firstResponse = await getAnimeSearch({ min_score: minScore, limit: 1 }, thunkAPI.signal);

    console.log('firstResponse', firstResponse);
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
