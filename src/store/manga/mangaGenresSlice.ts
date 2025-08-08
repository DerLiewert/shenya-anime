import { getMangaGenres } from '@/api';
import { Genre } from '@/models';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  items: Genre[];
  status: FetchStatus;
}

const initialState: InitialState = {
  items: [],
  status: FetchStatus.LOADING,
};

const mangaGenresSlice = createSlice({
  name: 'manga-genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMangaGenres.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchMangaGenres.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchMangaGenres.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export const fetchMangaGenres = createAsyncThunk<Genre[]>(
  'manga-genres/fetchMangaGenres',
  async () => {
    return (await getMangaGenres()).data;
  },
);

export default mangaGenresSlice.reducer;
