import { createSlice } from '@reduxjs/toolkit';
import {
  CommonCharacter,
  JikanImages,
  JikanNews,
  MangaFull,
  Recommendation,
  StatisticsScore,
} from '@/typescript';
import { DataWithPagePagination } from '@/typescript';
import {
  getMangaCharacters,
  getMangaFullById,
  getMangaNews,
  getMangaPictures,
  getMangaRecommendations,
  getMangaStatistics,
} from '@/api/client/manga.client';
import { createMangaThunkWithId, toDataWithPagePagination } from '@/utils';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import {
  createEntityDetailsState,
  entityDetailsBuilder,
  EntityDetailsStateBase,
  FetchListArgs,
} from '../_common';

export interface MangaFullState extends EntityDetailsStateBase<MangaFull> {
  scoreStats: StatisticsScore[];
  characters: CommonCharacter[];
  pictures: JikanImages[];
  news: DataWithPagePagination<JikanNews>;
  recommendations: Recommendation[];
}

const initialState: MangaFullState = {
  ...createEntityDetailsState(),
  scoreStats: [],
  characters: [],
  pictures: [],
  news: {
    data: [],
    pagination: null,
  },
  recommendations: [],
};

export const mangaFullByIdSlice = createSlice({
  name: 'manga-full',
  initialState,
  reducers: {
    resetMangaFull: () => initialState,
  },
  extraReducers: (builder) => {
    const handleAsync = entityDetailsBuilder(builder, initialState);

    handleAsync('item', fetchFullMangaById);
    handleAsync('scoreStats', fetchMangaScoreStats);
    handleAsync('characters', fetchMangaCharacters);
    handleAsync('pictures', fetchMangaPictures);
    handleAsync('recommendations', fetchMangaRecommendations);
    handleAsync('news', fetchMangaNews, (state, action) => {
      const { data, pagination } = action.payload;
      state.news.data = action.meta.arg.append ? [...state.news.data, ...data] : data;
      state.news.pagination = pagination;
    });
  },
});

export const { resetMangaFull } = mangaFullByIdSlice.actions;
export default mangaFullByIdSlice.reducer;

//========================================================================================================================================================

export const fetchFullMangaById = createAppAsyncThunk<MangaFull, number>(
  'anime-full/fetchFullById',
  async (id, { signal }) => (await getMangaFullById(id, signal)).data,
);

export const fetchMangaScoreStats = createMangaThunkWithId<StatisticsScore[]>(
  'manga-full/fetchScoreStats',
  (id, _, signal) => getMangaStatistics(id, signal).then((res) => res.data.scores),
);

export const fetchMangaCharacters = createMangaThunkWithId<CommonCharacter[]>(
  'manga-full/fetchCharacters',
  (id, _, signal) => getMangaCharacters(id, signal).then((res) => res.data),
);

export const fetchMangaPictures = createMangaThunkWithId<JikanImages[]>(
  'manga-full/fetchPictures',
  (id, _, signal) => getMangaPictures(id, signal).then((res) => res.data),
);

export const fetchMangaRecommendations = createMangaThunkWithId<Recommendation[]>(
  'manga-full/fetchRecommendations',
  (id, _, signal) => getMangaRecommendations(id, signal).then((res) => res.data),
);

//========================================================================================================================================================
export const fetchMangaNews = createMangaThunkWithId<
  DataWithPagePagination<JikanNews>,
  FetchListArgs<{ page?: number }>
>('manga-full/fetchNews', async (id, { params: { page = 1 } }, signal) => {
  const res = await getMangaNews(id, page, signal);
  return toDataWithPagePagination(res, page);
});
