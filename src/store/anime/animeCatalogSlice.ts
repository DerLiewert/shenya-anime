import { getAnimeSearch } from '@/api/anime.client';
import { Anime, AnimeSearchParams, JikanPaginationPlus, JikanResponse } from '@/models';
import { FetchStatus } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface InitialState {
  items: Anime[];
  pagination: JikanPaginationPlus | null;
  status: FetchStatus;
}

const initialState: InitialState = {
  items: [],
  pagination: null,
  status: FetchStatus.LOADING,
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
      // state.items = data ? data : [];
      // console.log(data, pagination);
      state.items = data ? data : [];
      state.pagination = pagination ? pagination : null;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchAnimeByParams.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export default animeCatalogSlice.reducer;

// export const fetchAnimeByParams = createAsyncThunk(
//   'anime-catalog/fetchAnimeByParams',
//   async (queryParams: AnimeSearchParams, { signal }) => {
//     return await getAnimeSearch(queryParams, signal);
//   },
// );

export const fetchAnimeByParams = createAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  AnimeSearchParams,
  { rejectValue: any }
>('anime-catalog/fetchAnimeByParams', async (queryParams, { signal, rejectWithValue }) => {
  try {
    return await getAnimeSearch({ ...queryParams, limit: 24 }, signal);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});
