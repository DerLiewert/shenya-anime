import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  Recommendation,
  StatisticsScore,
} from '@/models';
import { FetchStatus } from '@/types';

type DataKeys = Exclude<keyof AnimeFullState, 'isLoading' | 'error'>;

interface AnimeFullState {
  item: Anime | null;
  scoreStats: StatisticsScore[];
  episodes: {
    data: AnimeEpisode[];
    pagination: (JikanPaginationBase & { current_page: number }) | null;
  };
  characters: AnimeCharacter[];
  pictures: JikanImages[];
  videos: AnimeVideos | null;
  news: {
    data: JikanNews[];
    pagination: (JikanPaginationBase & { current_page: number }) | null;
  };
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
    // builder.addCase(fetchFullAnimeById.fulfilled, (state, action) => {
    //   state.item = action.payload;
    // });

    // const handleAsync = (key: keyof AnimeFullState, thunk: any) => {
    //   builder
    //     .addCase(thunk.pending, (state) => {
    //       state.isLoading[key] = true;
    //       state.error[key] = null;
    //     })
    //     .addCase(thunk.fulfilled, (state, action: PayloadAction<any>) => {
    //       state[key] = action.payload;
    //       state.isLoading[key] = false;
    //     })
    //     .addCase(thunk.rejected, (state, action) => {
    //       state.isLoading[key] = false;
    //       state.error[key] = action.error.message || 'Ошибка';
    //     });
    // };

    const handleAsync = <Returned, ThunkArg>(
      key: DataKeys,
      // key: Exclude<keyof AnimeFullState, 'isLoading' | 'error'>,
      thunk: AsyncThunk<Returned, ThunkArg, {}>,
      onFulfilled?: (
        state: AnimeFullState,
        action: PayloadAction<Returned, string, { arg: ThunkArg }>,
      ) => void,
    ) => {
      builder
        .addCase(thunk.pending, (state) => {
          if (key === 'item') {
            // Сохраняем текущий status объект
            const newStatus: AnimeFullState['status'] = {
              item: FetchStatus.LOADING,
            };

            // Сброс всех данных
            Object.assign(state, initialState);

            // Восстанавливаем статус для item
            state.status = newStatus;
          } else {
            state.status[key] = FetchStatus.LOADING;
          }
        })
        .addCase(
          thunk.fulfilled,
          (state, action: PayloadAction<Returned, string, { arg: ThunkArg }>) => {
            if (onFulfilled) {
              onFulfilled(state, action);
            } else {
              // @ts-expect-error
              // некоторые запросы выполняются но с ошибкой, нужно её где-то отлавливать и потом убрать if
              if (action.payload) state[key] = action.payload;
            }
            state.status[key] = FetchStatus.SUCCESS;
          },
        )
        .addCase(thunk.rejected, (state) => {
          state.status[key] = FetchStatus.ERROR;
        });
    };

    handleAsync('item', fetchFullAnimeById);
    handleAsync('scoreStats', fetchAnimeScoreStats);
    // handleAsync('episodes', fetchAnimeEpisodes);
    handleAsync('episodes', fetchAnimeEpisodes, (state, action) => {
      const page = action.meta.arg.page ? action.meta.arg.page : 1;
      const isShowMore = page && page > 1;

      const { data, pagination } = action.payload;

      state.episodes.data = isShowMore ? [...state.episodes.data, ...data] : data;

      if (pagination) {
        state.episodes.pagination = {
          ...pagination,
          current_page: page,
        };
      }
    });
    handleAsync('characters', fetchAnimeCharacters);
    handleAsync('pictures', fetchAnimePictures);
    handleAsync('videos', fetchAnimeVideos);
    // handleAsync('news', fetchAnimeNews);
    handleAsync('news', fetchAnimeNews, (state, action) => {
      const page = action.meta.arg.page ? action.meta.arg.page : 1;
      const isShowMore = page && page > 1;

      const { data, pagination } = action.payload;

      state.news.data = isShowMore ? [...state.news.data, ...data] : data;

      if (pagination) {
        state.news.pagination = {
          ...pagination,
          current_page: page,
        };
      }
    });
    handleAsync('recommendations', fetchAnimeRecommendations);
    handleAsync('staff', fetchAnimeStaff);
  },
});

export const { resetAnimeFull, setEpisodesPage } = animeFullByIdSlice.actions;
export default animeFullByIdSlice.reducer;

// export const fetchFullAnimeById = createAsyncThunk<Anime, number>(
//   'anime-full/fetchFullAnimeById',
//   async (id, { signal, rejectWithValue }) => {
//     const { data } = await getAnimeFullById(id, signal);
//     if (data) return data;
//     return rejectWithValue('Something went wrong');
//   },
// );

// export const fetchAnimeScoreStats = createAsyncThunk<StatisticsScore[], number>(
//   'anime-full/fetchAnimeScoreStats',
//   //   async (id, { signal }) => {
//   //     return (await getAnimeStatistics(id, signal)).data.scores;
//   //   },
//   // );
//   async (id, { signal, rejectWithValue }) => {
//     const { data } = await getAnimeStatistics(id, signal);
//     if (data) return data.scores;
//     return rejectWithValue('Something went wrong');
//   },
// );

export const fetchFullAnimeById = createAsyncThunk<Anime, number>(
  'anime-full/fetchFullAnimeById',
  async (id, { signal }) => {
    return (await getAnimeFullById(id, signal)).data;
  },
);

export const fetchAnimeScoreStats = createAsyncThunk<StatisticsScore[], number>(
  'anime-full/fetchAnimeScoreStats',
  async (id, { signal }) => {
    return (await getAnimeStatistics(id, signal)).data.scores;
  },
);

export const fetchAnimeEpisodes = createAsyncThunk(
  'anime-full/fetchAnimeEpisodes',
  async ({ id, page }: { id: number; page?: number }, { signal }) => {
    return await getAnimeEpisodes(id, page, signal);
  },
);

export const fetchAnimeCharacters = createAsyncThunk<AnimeCharacter[], number>(
  'anime-full/fetchAnimeCharacters',
  async (id, { signal }) => {
    return (await getAnimeCharacters(id, signal)).data;
  },
);

export const fetchAnimePictures = createAsyncThunk<JikanImages[], number>(
  'anime-full/fetchAnimePictures',
  async (id, { signal }) => {
    return (await getAnimePictures(id, signal)).data;
  },
);

export const fetchAnimeVideos = createAsyncThunk<AnimeVideos, number>(
  'anime-full/fetchAnimeVideos',
  async (id, { signal }) => {
    return (await getAnimeVideos(id, signal)).data;
  },
);

export const fetchAnimeNews = createAsyncThunk(
  'anime-full/fetchAnimeNews',
  async ({ id, page }: { id: number; page?: number }, { signal }) => {
    return await getAnimeNews(id, page, signal);
  },
);

export const fetchAnimeRecommendations = createAsyncThunk<Recommendation[], number>(
  'anime-full/fetchAnimeRecommendations',
  async (id, { signal }) => {
    return (await getAnimeRecommendations(id, signal)).data;
  },
);

export const fetchAnimeStaff = createAsyncThunk<AnimeStaff[], number>(
  'anime-full/fetchAnimeStaff',
  async (id, { signal }) => {
    return (await getAnimeStaff(id, signal)).data;
  },
);
