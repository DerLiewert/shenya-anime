import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAnimeSearch } from '@/api';
import {
  Anime,
  AnimeSearchParams,
  JikanPaginationPlus,
  JikanResponse,
  FetchStatus,
} from '@/typescript';

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

//========================================================================================================================================================
export const fetchAnimeByParams = createAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  AnimeSearchParams
>('anime-catalog/fetchAnimeByParams', async (queryParams, { signal }) =>
  getAnimeSearch({ limit: 24, ...queryParams }, signal),
);
