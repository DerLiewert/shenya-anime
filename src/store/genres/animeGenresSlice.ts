import { getAnimeGenres } from '@/api';
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

const animeGenresSlice = createSlice({
  name: 'anime-genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAnimeGenres.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchAnimeGenres.fulfilled, (state, action) => {
      state.items = action.payload.sort((obj1, obj2) => {
        if (obj1.name < obj2.name) return -1;
        if (obj1.name > obj2.name) return 1;
        return 0;
      });
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchAnimeGenres.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export default animeGenresSlice.reducer;

//========================================================================================================================================================
export const fetchAnimeGenres = createAsyncThunk<Genre[]>(
  'anime-genres/fetchGenres',
  async () => (await getAnimeGenres()).data,
);
