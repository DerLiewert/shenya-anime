import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  getAnimeCharacters,
  getAnimeEpisodes,
  getAnimeFullById,
  getAnimeNews,
  getAnimePictures,
  getAnimeRecommendations,
  getAnimeStaff,
  getAnimeStatistics,
  getAnimeVideos,
} from '@/api/client/anime.client';
import {
  AnimeCharacter,
  AnimeEpisode,
  AnimeFull,
  AnimeStaff,
  AnimeVideos,
  JikanImages,
  JikanNews,
  Recommendation,
  StatisticsScore,
} from '@/typescript';
import { DataWithExtendedBasicPagination, FetchStatus } from '@/typescript';
import { createAnimeThunkWithId, bilderHandleAsync, toDataWithExtendedBasicPagination } from '@/utils';

type DataKeys = Exclude<keyof AnimeFullState, 'status'>;

export interface AnimeFullState {
  item: AnimeFull | null;
  scoreStats: StatisticsScore[];
  episodes: DataWithExtendedBasicPagination<AnimeEpisode>;
  characters: AnimeCharacter[];
  pictures: JikanImages[];
  videos: AnimeVideos | null;
  news: DataWithExtendedBasicPagination<JikanNews>;
  staff: AnimeStaff[];
  recommendations: Recommendation[];
  status: Partial<Record<DataKeys, FetchStatus>>;
}

const initialState: AnimeFullState = {
  item: null,
  scoreStats: [],
  episodes: {
    data: [],
    pagination: null,
  },
  characters: [],
  pictures: [],
  videos: null,
  news: {
    data: [],
    pagination: null,
  },
  recommendations: [],
  staff: [],
  status: {},
};

export const animeFullByIdSlice = createSlice({
  name: 'anime-full',
  initialState,
  reducers: {
    resetAnimeFull: () => initialState,
    setEpisodesPage: (state: AnimeFullState, action: PayloadAction<number>) => {
      if (state.episodes.pagination) {
        state.episodes.pagination.current_page = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    const handleAsync = bilderHandleAsync(builder, initialState);

    handleAsync('item', fetchFullAnimeById);
    handleAsync('scoreStats', fetchAnimeScoreStats);
    handleAsync('characters', fetchAnimeCharacters);
    handleAsync('pictures', fetchAnimePictures);
    handleAsync('videos', fetchAnimeVideos);
    handleAsync('recommendations', fetchAnimeRecommendations);
    handleAsync('staff', fetchAnimeStaff);
    handleAsync('episodes', fetchAnimeEpisodes, (state, action) => {
      const page = action.meta.arg.page ? action.meta.arg.page : 1;
      const isShowMore = page && page > 1;

      const { data, pagination } = action.payload;

      state.episodes.data = isShowMore ? [...state.episodes.data, ...data] : data;
      state.episodes.pagination = pagination;
    });
    handleAsync('news', fetchAnimeNews, (state, action) => {
      const page = action.meta.arg.page ? action.meta.arg.page : 1;
      const isShowMore = page && page > 1;

      const { data, pagination } = action.payload;

      state.news.data = isShowMore ? [...state.news.data, ...data] : data;
      state.news.pagination = pagination;
    });
  },
});

export const { resetAnimeFull, setEpisodesPage } = animeFullByIdSlice.actions;
export default animeFullByIdSlice.reducer;

//========================================================================================================================================================

export const fetchFullAnimeById = createAsyncThunk<AnimeFull, number>(
  'anime-full/fetchFullAnimeById',
  async (id, { signal }) => (await getAnimeFullById(id, signal)).data,
);

export const fetchAnimeScoreStats = createAnimeThunkWithId<StatisticsScore[]>(
  'anime-full/fetchAnimeScoreStats',
  (id, _, signal) => getAnimeStatistics(id, signal).then((res) => res.data.scores),
);

export const fetchAnimeCharacters = createAnimeThunkWithId<AnimeCharacter[]>(
  'anime-full/fetchAnimeCharacters',
  (id, _, signal) => getAnimeCharacters(id, signal).then((res) => res.data),
);

export const fetchAnimePictures = createAnimeThunkWithId<JikanImages[]>(
  'anime-full/fetchAnimePictures',
  (id, _, signal) => getAnimePictures(id, signal).then((res) => res.data),
);

export const fetchAnimeVideos = createAnimeThunkWithId<AnimeVideos>(
  'anime-full/fetchAnimeVideos',
  (id, _, signal) => getAnimeVideos(id, signal).then((res) => res.data),
);

export const fetchAnimeRecommendations = createAnimeThunkWithId<Recommendation[]>(
  'anime-full/fetchAnimeRecommendations',
  (id, _, signal) => getAnimeRecommendations(id, signal).then((res) => res.data),
);

export const fetchAnimeStaff = createAnimeThunkWithId<AnimeStaff[]>(
  'anime-full/fetchAnimeStaff',
  (id, _, signal) => getAnimeStaff(id, signal).then((res) => res.data),
);

//========================================================================================================================================================
export const fetchAnimeEpisodes = createAnimeThunkWithId<
  DataWithExtendedBasicPagination<AnimeEpisode>,
  { page?: number }
>('anime-full/fetchAnimeEpisodes', async (id, { page = 1 }, signal) => {
  const res = await getAnimeEpisodes(id, page, signal);
  return toDataWithExtendedBasicPagination(res, page);
});

export const fetchAnimeNews = createAnimeThunkWithId<
  DataWithExtendedBasicPagination<JikanNews>,
  { page?: number }
>('anime-full/fetchAnimeNews', async (id, { page = 1 }, signal) => {
  const res = await getAnimeNews(id, page, signal);
  return toDataWithExtendedBasicPagination(res, page);
});
