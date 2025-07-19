import {
  AsyncThunk,
  CaseReducer,
  createAsyncThunk,
  createSlice,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';

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
} from '@/api/anime.client';
import {
  Anime,
  AnimeCharacter,
  AnimeEpisode,
  AnimeStaff,
  AnimeVideos,
  JikanImages,
  JikanNews,
  JikanPaginationBase,
  JikanResponse,
  Recommendation,
  StatisticsScore,
} from '@/models';
import { FetchStatus } from '@/types';
import { RootState } from '@/app/store';

type DataKeys = Exclude<keyof AnimeFullState, 'isLoading' | 'error'>;

type DataWithPagination<T> = {
  data: T[];
  pagination: (JikanPaginationBase & { current_page: number }) | null;
};

interface AnimeFullState {
  item: Anime | null;
  scoreStats: StatisticsScore[];
  episodes: DataWithPagination<AnimeEpisode>;
  characters: AnimeCharacter[];
  pictures: JikanImages[];
  videos: AnimeVideos | null;
  news: DataWithPagination<JikanNews>;
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
    const handleAsync = <
      K extends DataKeys,
      Returned extends AnimeFullState[K],
      ThunkArg = void,
      ThunkConfig extends {} = {},
    >(
      key: K,
      thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
      onFulfilled?: CaseReducer<Draft<AnimeFullState>, ReturnType<typeof thunk.fulfilled>>,
    ) => {
      builder
        .addCase(thunk.pending, (state) => {
          if (key === 'item') {
            const newStatus: AnimeFullState['status'] = {
              item: FetchStatus.LOADING,
            };
            Object.assign(state, initialState);
            state.status = newStatus;
          } else {
            state.status[key] = FetchStatus.LOADING;
          }
        })
        .addCase(thunk.fulfilled, (state, action) => {
          if (onFulfilled) {
            onFulfilled(state, action);
          } else {
            if (action.payload) state[key] = action.payload;
          }
          state.status[key] = FetchStatus.SUCCESS;
        })
        .addCase(thunk.rejected, (state) => {
          state.status[key] = FetchStatus.ERROR;
        });
    };

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
function createAnimeThunkWithId<Returned, Arg = void>(
  typePrefix: string,
  callback: (id: number, arg: Arg, signal: AbortSignal) => Promise<Returned>,
) {
  return createAsyncThunk<Returned, Arg, { state: RootState; rejectValue: string }>(
    typePrefix,
    async (arg, { getState, signal, rejectWithValue }) => {
      const id: number | undefined = getState().animeFullById.item?.mal_id;
      if (!id) return rejectWithValue('Anime ID is missing');
      return callback(id, arg, signal);
    },
  );
}

export const fetchFullAnimeById = createAsyncThunk<Anime, number>(
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
function toDataWithPagination<T>(
  response: JikanResponse<T[], JikanPaginationBase | undefined>,
  page: number,
): DataWithPagination<T> {
  return {
    data: response.data,
    pagination: response.pagination ? { ...response.pagination, current_page: page } : null,
  };
}

export const fetchAnimeEpisodes = createAnimeThunkWithId<
  DataWithPagination<AnimeEpisode>,
  { page?: number }
>('anime-full/fetchAnimeEpisodes', async (id, { page = 1 }, signal) => {
  const res = await getAnimeEpisodes(id, page, signal);
  return toDataWithPagination(res, page);
});

export const fetchAnimeNews = createAnimeThunkWithId<
  DataWithPagination<JikanNews>,
  { page?: number }
>('anime-full/fetchAnimeNews', async (id, { page = 1 }, signal) => {
  const res = await getAnimeNews(id, page, signal);
  return toDataWithPagination(res, page);
});
