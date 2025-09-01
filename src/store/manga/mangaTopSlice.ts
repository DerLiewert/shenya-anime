import { TopEndpoints } from '@/api';
import { getResource } from '@/api/api.client';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Manga } from '@/models';

export const fetchTopManga = createAsyncThunk<Manga[]>(
  'top-manga/fetchTopManga',
  async (_, { signal }) => {
    const { data } = await getResource<Manga[]>({
      endpoint: TopEndpoints.topManga,
      queryParams: { limit: 10 },
      signal,
    });
    return data;
  },
);

interface topMangaState {
  items: Manga[];
  status: FetchStatus;
}

const initialState: topMangaState = {
  items: [],
  status: FetchStatus.LOADING,
};

export const mangaTopSlice = createSlice({
  name: 'intro-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTopManga.pending, (state, action) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchTopManga.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchTopManga.rejected, (state, action) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

// export const {  } = mangaTopSlice.actions;

export default mangaTopSlice.reducer;
