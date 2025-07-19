import { getPersonFullById, getPersonPictures } from '@/api/person.client';
import { RootState } from '@/app/store';
import { JikanImages, PersonFull } from '@/models';
import { FetchStatus } from '@/types';
import { AsyncThunk, CaseReducer, createAsyncThunk, createSlice, Draft } from '@reduxjs/toolkit';

type DataKeys = Exclude<keyof PersonFullState, 'isLoading' | 'error'>;

interface PersonFullState {
  item: PersonFull | null;
  pictures: JikanImages[];
  status: Partial<Record<DataKeys, FetchStatus>>;
}

const initialState: PersonFullState = {
  item: null,
  pictures: [],
  status: {},
};

const personFullByIdSlice = createSlice({
  name: 'person-full',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
     const handleAsync = <
      K extends DataKeys,
      Returned extends PersonFullState[K],
      ThunkArg = void,
      ThunkConfig extends {} = {},
    >(
      key: K,
      thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
      onFulfilled?: CaseReducer<Draft<PersonFullState>, ReturnType<typeof thunk.fulfilled>>,
    ) => {
      builder
        .addCase(thunk.pending, (state) => {
          if (key === 'item') {
            const newStatus: PersonFullState['status'] = {
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

    handleAsync('item', fetchPersonFullById);
    handleAsync('pictures', fetchPersonPictures);
  },
});

export default personFullByIdSlice.reducer;

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
      const id: number | undefined = getState().personFullById.item?.mal_id;
      if (!id) return rejectWithValue('Person ID is missing');
      return callback(id, arg, signal);
    },
  );
}

export const fetchPersonFullById = createAsyncThunk<PersonFull, number>(
  'person-full/fetchFullById',
  async (id, { signal }) => {
    return (await getPersonFullById(id, signal)).data;
  },
);

export const fetchPersonPictures = createMangaThunkWithId<JikanImages[]>(
  'person-full/fetchPictures',
  (id, _, signal) => getPersonPictures(id, signal).then((res) => res.data),
);
