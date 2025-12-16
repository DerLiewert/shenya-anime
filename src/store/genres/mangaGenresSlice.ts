import { getMangaGenres } from '@/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Genre, FetchStatus } from '@/typescript';

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
      state.items = action.payload.sort((obj1, obj2) => {
        if (obj1.name < obj2.name) return -1;
        if (obj1.name > obj2.name) return 1;
        return 0;
      });
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchMangaGenres.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export default mangaGenresSlice.reducer;

//========================================================================================================================================================
export const fetchMangaGenres = createAsyncThunk<Genre[]>(
  'manga-genres/fetchGenres',
  async () => (await getMangaGenres()).data,
);
