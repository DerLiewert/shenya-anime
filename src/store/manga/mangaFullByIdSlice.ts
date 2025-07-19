import {
  AsyncThunk,
  CaseReducer,
  createAsyncThunk,
  createSlice,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  CommonCharacter,
  JikanImages,
  JikanNews,
  JikanPaginationBase,
  JikanResponse,
  Manga,
  Recommendation,
  StatisticsScore,
} from '@/models';
import { FetchStatus } from '@/types';
import {
  getMangaCharacters,
  getMangaFullById,
  getMangaNews,
  getMangaPictures,
  getMangaRecommendations,
  getMangaStatistics,
} from '@/api/manga.client';
import { RootState } from '@/app/store';

type DataKeys = Exclude<keyof MangaFullState, 'isLoading' | 'error'>;
type DataWithPagination<T> = {
  data: T[];
  pagination: (JikanPaginationBase & { current_page: number }) | null;
};

interface MangaFullState {
  item: Manga | null;
  scoreStats: StatisticsScore[];
  characters: CommonCharacter[];
  pictures: JikanImages[];
  news: DataWithPagination<JikanNews>;
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
    const handleAsync = <
      K extends DataKeys,
      Returned extends MangaFullState[K],
      ThunkArg = void,
      ThunkConfig extends {} = {},
    >(
      key: K,
      thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
      onFulfilled?: CaseReducer<Draft<MangaFullState>, ReturnType<typeof thunk.fulfilled>>,
    ) => {
      builder
        .addCase(thunk.pending, (state) => {
          if (key === 'item') {
            const newStatus: MangaFullState['status'] = {
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
type AsyncThunkOptions = { state: RootState; rejectValue: string };

export type CustomAsyncThunk<Returned, Arg = void> = AsyncThunk<Returned, Arg, AsyncThunkOptions>;

function createMangaThunkWithId<Returned, Arg = void>(
  typePrefix: string,
  callback: (id: number, arg: Arg, signal: AbortSignal) => Promise<Returned>,
) {
  return createAsyncThunk<Returned, Arg, AsyncThunkOptions>(
    typePrefix,
    async (arg, { getState, signal, rejectWithValue }) => {
      const id: number | undefined = getState().mangaFullById.item?.mal_id;
      if (!id) return rejectWithValue('Manga ID is missing');
      return callback(id, arg, signal);
    },
  );
}

export const fetchFullMangaById = createAsyncThunk<Manga, number>(
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
function toDataWithPagination<T>(
  response: JikanResponse<T[], JikanPaginationBase | undefined>,
  page: number,
): DataWithPagination<T> {
  return {
    data: response.data,
    pagination: response.pagination ? { ...response.pagination, current_page: page } : null,
  };
}

export const fetchMangaNews = createMangaThunkWithId<
  DataWithPagination<JikanNews>,
  { page?: number }
>('manga-full/fetchNews', async (id, { page = 1 }, signal) => {
  const res = await getMangaNews(id, page, signal);
  return toDataWithPagination(res, page);
});
