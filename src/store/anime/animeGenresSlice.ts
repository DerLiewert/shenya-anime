import { getAnimeGenres } from '@/api';
import { Genre } from '@/models';
import { FetchStatus } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  items: Genre[];
  status: FetchStatus;
}

const initialState: InitialState = {
  items: [],
  status: FetchStatus.LOADING,
};

const animeGenresSlice = createSlice({
  name: 'anime-genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAnimeGenres.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchAnimeGenres.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchAnimeGenres.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export const fetchAnimeGenres = createAsyncThunk<Genre[]>(
  'anime-genres/fetchAnimeGenres',
  async () => {
    return (await getAnimeGenres()).data;
  },
);

export default animeGenresSlice.reducer;
