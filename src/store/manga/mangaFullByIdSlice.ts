import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Manga } from '@/models';
import { FetchStatus } from '@/types';
import { getMangaFullById } from '@/api/manga.client';

type DataKeys = Exclude<keyof MangaFullState, 'isLoading' | 'error'>;

interface MangaFullState {
  item: Manga | null;
  status: Partial<Record<DataKeys, FetchStatus>>;
}

const initialState: MangaFullState = {
  item: null,
  status: {},
};

export const mangaFullByIdSlice = createSlice({
  name: 'manga-full',
  initialState,
  reducers: {
    resetMangaFull: () => initialState,
  },
  extraReducers: (builder) => {
    const handleAsync = <Returned, ThunkArg>(
      key: DataKeys,
      thunk: AsyncThunk<Returned, ThunkArg, {}>,
      onFulfilled?: (
        state: MangaFullState,
        action: PayloadAction<Returned, string, { arg: ThunkArg }>,
      ) => void,
    ) => {
      builder
        .addCase(thunk.pending, (state) => {
          if (key === 'item') {
            // Сохраняем текущий status объект
            const newStatus: MangaFullState['status'] = {
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

    handleAsync('item', fetchFullMangaById);
  },
});

export const { resetMangaFull } = mangaFullByIdSlice.actions;
export default mangaFullByIdSlice.reducer;

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

export const fetchFullMangaById = createAsyncThunk<Manga, number>(
  'manga-full/fetchFullMangaById',
  async (id, { signal }) => {
    return (await getMangaFullById(id, signal)).data;
  },
);
