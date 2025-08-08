import { getMangaSearch } from '@/api/manga.client';
import { JikanPaginationPlus, JikanResponse, Manga, MangaSearchParams } from '@/models';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface InitialState {
  items: Manga[];
  pagination: JikanPaginationPlus | null;
  status: FetchStatus;
}

const initialState: InitialState = {
  items: [],
  pagination: null,
  status: FetchStatus.LOADING,
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
    builder.addCase(fetchMangaByParams.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export default mangaCatalogSlice.reducer;

export const fetchMangaByParams = createAsyncThunk<
  JikanResponse<Manga[], JikanPaginationPlus>,
  MangaSearchParams,
  { rejectValue: any }
>('manga-catalog/fetchMangaByParams', async (queryParams, { signal, rejectWithValue }) => {
  try {
    return await getMangaSearch({ ...queryParams, limit: 24 }, signal);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});
