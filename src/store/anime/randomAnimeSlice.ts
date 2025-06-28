import { getResource } from '@/api/api.client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Anime, JikanPaginationPlus } from '../../models';
import { randomInteger } from '../../utils';

// export const fetchRandomAnime = createAsyncThunk('random-anime/fetchRandomAnime', async () => {
//   const lastPage = await (
//     await axios.get(`https://api.jikan.moe/v4/anime?min_score=8&limit=1`)
//   ).data.pagination.last_visible_page;

//   const page = randomInteger(1, lastPage);
//   const { data } = await axios.get(
//     `https://api.jikan.moe/v4/anime?min_score=8&limit=1&page=${page}`,
//   );
//   return data.data[0];
// });

// export const fetchRandomAnime = createAsyncThunk<Anime, void, { state: RootState }>(
//   'random-anime/fetchRandomAnime',
//   async (_, thunkAPI) => {
//     const minScore = thunkAPI.getState().randomAnime.minScore;

//     const {
//       data: {
//         pagination: { last_visible_page },
//       },
//     } = await axios.get(`https://api.jikan.moe/v4/anime?min_score=${minScore}&limit=1`);

//     const page = randomInteger(1, last_visible_page);

//     const {
//       data: { data },
//     } = await axios.get(
//       `https://api.jikan.moe/v4/anime?min_score=${minScore}&limit=1&page=${page}`,
//     );

//     return data[0];
//   },
// );

export const fetchRandomAnime = createAsyncThunk<Anime, void, { state: RootState }>(
  'random-anime/fetchRandomAnime',
  async (_, thunkAPI) => {
    const minScore = thunkAPI.getState().randomAnime.minScore;

    // const { data: firstResponse } = await axios.get<JikanResponse<Anime[]>>(
    //   `https://api.jikan.moe/v4/anime?min_score=${minScore}&limit=1`
    // );

    // Получаем количество страниц
    const firstResponse = await getResource<Anime[], JikanPaginationPlus>({
      endpoint: `https://api.jikan.moe/v4/anime`,
      queryParams: {
        min_score: minScore,
        limit: 1,
      },
      signal: thunkAPI.signal,
    });

    if (!firstResponse.pagination || firstResponse.pagination.last_visible_page === 0) {
      return thunkAPI.rejectWithValue('Pagination data missing or empty');
    }

    const totalPages = firstResponse.pagination.last_visible_page;
    const page = randomInteger(1, totalPages);

    // const { data: pageResponse } = await axios.get<JikanResponse<Anime[]>>(
    //   `https://api.jikan.moe/v4/anime?min_score=${minScore}&limit=1&page=${page}`,
    // );

    // Получаем случайное аниме с этой страницы
    const pageResponse = await getResource<Anime[], JikanPaginationPlus>({
      endpoint: `https://api.jikan.moe/v4/anime`,
      queryParams: {
        min_score: minScore,
        limit: 1,
        page,
      },
      signal: thunkAPI.signal,
    });

    if (!pageResponse.data.length) {
      return thunkAPI.rejectWithValue('No anime found on selected page');
    }

    return pageResponse.data[0];
  },
);

interface randomAnimeState {
  item: Anime | null;
  minScore: number;
}

const initialState: randomAnimeState = {
  item: null,
  minScore: 8,
};

export const randomAnimeSlice = createSlice({
  name: 'random-anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRandomAnime.fulfilled, (state, action) => {
      state.item = action.payload;
    });
  },
});

// export const {} = randomAnimeSlice.actions

export default randomAnimeSlice.reducer;
