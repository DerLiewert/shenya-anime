import { getAnimeSearch } from '@/api/client/anime.client';
import { RootState } from '@/app/store';
import { Anime, AnimeSearchParams, JikanPaginationPlus, JikanResponse } from '@/models';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  items: Anime[];
  pagination: JikanPaginationPlus | null;
  status: FetchStatus | null;
}

const initialState: InitialState = {
  items: [],
  pagination: null,
  status: null,
};

const animeCatalogSlice = createSlice({
  name: 'anime-catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAnimeByParams.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchAnimeByParams.fulfilled, (state, action) => {
      const { data, pagination } = action.payload;
      state.items = data ? data : [];
      state.pagination = pagination ? pagination : null;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchAnimeByParams.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.status = FetchStatus.ERROR;
    });
  },
});

export default animeCatalogSlice.reducer;

export const fetchAnimeByParams = createAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  AnimeSearchParams,
  { rejectValue: any }
>('anime-catalog/fetchAnimeByParams', async (queryParams, { signal, getState }) => {
  const { sfw } = (getState() as RootState).settings;
  return await getAnimeSearch({ limit: 24, ...queryParams, sfw }, signal);
});
