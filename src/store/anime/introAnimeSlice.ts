import { getResource } from '@/api/client/api.client';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Anime } from '@/typescript';
import { SchedulesEndpoints, TopEndpoints } from '@/api';

export const fetchIntroAnime = createAsyncThunk<Anime[], undefined>(
  'intro-anime/fetchAnimeItems',
  async (_, { signal }) => {
    const { data } = await getResource<Anime[]>({
      endpoint: TopEndpoints.topAnime,
      queryParams: { limit: 25 },
      signal,
    });
    return data;
  },
);

interface IntroAnimeState {
  items: Anime[];
  status: FetchStatus | null;
}

const initialState: IntroAnimeState = {
  items: [],
  status: null,
};

export const introAnimeSlice = createSlice({
  name: 'intro-anime',
  initialState,
  reducers: {
    resetIntroAnime: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIntroAnime.pending, (state, action) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchIntroAnime.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchIntroAnime.rejected, (state, action) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export const { resetIntroAnime } = introAnimeSlice.actions;

export default introAnimeSlice.reducer;
