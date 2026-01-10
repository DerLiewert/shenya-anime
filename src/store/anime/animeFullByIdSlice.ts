import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
import { DataWithPagePagination } from '@/typescript';
import { createAnimeThunkWithId, toDataWithPagePagination } from '@/utils';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import {
  createEntityDetailsState,
  entityDetailsBuilder,
  EntityDetailsStateBase,
} from '../_common/entityDetails.helper';
import { FetchListArgs } from '../_common';

export interface AnimeFullState extends EntityDetailsStateBase<AnimeFull> {
  scoreStats: StatisticsScore[];
  episodes: DataWithPagePagination<AnimeEpisode>;
  characters: AnimeCharacter[];
  pictures: JikanImages[];
  videos: AnimeVideos | null;
  news: DataWithPagePagination<JikanNews>;
  staff: AnimeStaff[];
  recommendations: Recommendation[];
}

const initialState: AnimeFullState = {
  ...createEntityDetailsState(),
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
    const handleAsync = entityDetailsBuilder(builder, initialState);

    handleAsync('item', fetchFullAnimeById);
    handleAsync('scoreStats', fetchAnimeScoreStats);
    handleAsync('characters', fetchAnimeCharacters);
    handleAsync('pictures', fetchAnimePictures);
    handleAsync('videos', fetchAnimeVideos);
    handleAsync('recommendations', fetchAnimeRecommendations);
    handleAsync('staff', fetchAnimeStaff);
    handleAsync('episodes', fetchAnimeEpisodes, (state, action) => {
      const { data, pagination } = action.payload;
      state.episodes.data = action.meta.arg.append ? [...state.episodes.data, ...data] : data;
      state.episodes.pagination = pagination;
    });
    handleAsync('news', fetchAnimeNews, (state, action) => {
      const { data, pagination } = action.payload;
      state.news.data = action.meta.arg.append ? [...state.news.data, ...data] : data;
      state.news.pagination = pagination;
    });
  },
});

export const { resetAnimeFull, setEpisodesPage } = animeFullByIdSlice.actions;
export default animeFullByIdSlice.reducer;

//========================================================================================================================================================

export const fetchFullAnimeById = createAppAsyncThunk<AnimeFull, number>(
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
  DataWithPagePagination<AnimeEpisode>,
  FetchListArgs<{ page?: number }>
>('anime-full/fetchAnimeEpisodes', async (id, { params: { page = 1 } }, signal) => {
  const res = await getAnimeEpisodes(id, page, signal);
  return toDataWithPagePagination(res, page);
});

export const fetchAnimeNews = createAnimeThunkWithId<
  DataWithPagePagination<JikanNews>,
  FetchListArgs<{ page?: number }>
>('anime-full/fetchAnimeNews', async (id, { params: { page = 1 } }, signal) => {
  const res = await getAnimeNews(id, page, signal);
  return toDataWithPagePagination(res, page);
});
