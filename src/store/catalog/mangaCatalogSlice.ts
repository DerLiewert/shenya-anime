import { getMangaSearch } from '@/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  JikanPaginationPlus,
  JikanResponse,
  Manga,
  MangaSearchParams,
  FetchStatus,
} from '@/typescript';

import axios from 'axios';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';

interface InitialState {
  items: Manga[];
  pagination: JikanPaginationPlus | null;
  status: FetchStatus | null;
}

const initialState: InitialState = {
  items: [],
  pagination: null,
  status: null,
};

const mangaCatalogSlice = createSlice({
  name: 'manga-catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMangaByParams.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchMangaByParams.fulfilled, (state, action) => {
      const { data, pagination } = action.payload;
      state.items = data ? data : [];
      state.pagination = pagination ? pagination : null;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchMangaByParams.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.status = FetchStatus.ERROR;
    });
  },
});

export default mangaCatalogSlice.reducer;

//========================================================================================================================================================
export const fetchMangaByParams = createAppAsyncThunk<
  JikanResponse<Manga[], JikanPaginationPlus>,
  MangaSearchParams
>(
  'manga-catalog/fetchMangaByParams',
  async (queryParams, { signal }) => await getMangaSearch({ limit: 24, ...queryParams }, signal),
);
