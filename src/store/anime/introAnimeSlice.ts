import { getResource } from '@/api/api.client';
import { FetchStatus } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Anime } from '../../models';

export const fetchIntroAnime = createAsyncThunk<Anime[]>(
  'intro-anime/fetchAnimeItems',
  async (_, { signal }) => {
    const { data } = await getResource<Anime[]>({
      endpoint: 'https://api.jikan.moe/v4/top/anime',
      queryParams: { limit: 10 },
      signal,
    });
    //   // axios.get('https://api.jikan.moe/v4/schedules?filter=thursday').then(({ data }) => {
    //   // axios.get('https://api.jikan.moe/v4/anime?status=upcoming').then(({ data }) => {
    return data;
  },
);

interface IntroAnimeState {
  items: Anime[];
  status: FetchStatus;
}

const initialState: IntroAnimeState = {
  items: [],
  status: FetchStatus.LOADING,
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

// Action creators are generated for each case reducer function
export const { resetIntroAnime } = introAnimeSlice.actions;

export default introAnimeSlice.reducer;
