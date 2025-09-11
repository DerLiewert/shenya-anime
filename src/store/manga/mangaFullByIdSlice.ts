import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  CommonCharacter,
  JikanImages,
  JikanNews,
  MangaFull,
  Recommendation,
  StatisticsScore,
} from '@/models';
import { DataWithExtendedBasicPagination, FetchStatus } from '@/typescript';
import {
  getMangaCharacters,
  getMangaFullById,
  getMangaNews,
  getMangaPictures,
  getMangaRecommendations,
  getMangaStatistics,
} from '@/api/manga.client';
import { createHandle, createMangaThunkWithId, toDataWithExtendedBasicPagination } from '@/utils';

type DataKeys = Exclude<keyof MangaFullState, 'status'>;

export interface MangaFullState {
  item: MangaFull | null;
  scoreStats: StatisticsScore[];
  characters: CommonCharacter[];
  pictures: JikanImages[];
  news: DataWithExtendedBasicPagination<JikanNews>;
  recommendations: Recommendation[];
  status: Partial<Record<DataKeys, FetchStatus>>;
}

const initialState: MangaFullState = {
  item: null,
  scoreStats: [],
  characters: [],
  pictures: [],
  news: {
    data: [],
    pagination: null,
  },
  recommendations: [],
  status: {},
};

export const mangaFullByIdSlice = createSlice({
  name: 'manga-full',
  initialState,
  reducers: {
    resetMangaFull: () => initialState,
  },
  extraReducers: (builder) => {
    const handleAsync = createHandle(builder, initialState);

    handleAsync('item', fetchFullMangaById);
    handleAsync('scoreStats', fetchMangaScoreStats);
    handleAsync('characters', fetchMangaCharacters);
    handleAsync('pictures', fetchMangaPictures);
    handleAsync('recommendations', fetchMangaRecommendations);
    handleAsync('news', fetchMangaNews, (state, action) => {
      const page = action.meta.arg.page ? action.meta.arg.page : 1;
      const isShowMore = page && page > 1;

      const { data, pagination } = action.payload;
      state.news.data = isShowMore ? [...state.news.data, ...data] : data;
      state.news.pagination = pagination;
    });
  },
});

export const { resetMangaFull } = mangaFullByIdSlice.actions;
export default mangaFullByIdSlice.reducer;

//========================================================================================================================================================

export const fetchFullMangaById = createAsyncThunk<MangaFull, number>(
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
  DataWithExtendedBasicPagination<JikanNews>,
  { page?: number }
>('manga-full/fetchNews', async (id, { page = 1 }, signal) => {
  const res = await getMangaNews(id, page, signal);
  return toDataWithExtendedBasicPagination(res, page);
});
