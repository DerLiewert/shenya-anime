import { getResource } from '@/api/client/api.client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Anime, FetchStatus } from '@/typescript';

export const fetchSeasonalAnime = createAsyncThunk<Anime[]>(
  'seasonal-anime/fetchAnimeItems',
  async (_, { signal }) => {
    const { data } = await getResource<Anime[]>({
      endpoint: `https://api.jikan.moe/v4/seasons/now`,
      signal,
    });
    // const { data } = await axios.get<JikanResponse<Anime[]>>(
    //   'https://api.jikan.moe/v4/seasons/now',
    // );
    return data;
  },
);

interface SeasonalAnimeState {
  items: Anime[];
  status: FetchStatus | null;
}

const initialState: SeasonalAnimeState = {
  items: [],
  status: null,
};

export const seasonalAnimeSlice = createSlice({
  name: 'seasonal-anime',
  initialState,
  reducers: {
    setSeasonalAnimeItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeasonalAnime.pending, (state, action) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchSeasonalAnime.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchSeasonalAnime.rejected, (state, action) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export const { setSeasonalAnimeItems } = seasonalAnimeSlice.actions;

export default seasonalAnimeSlice.reducer;
