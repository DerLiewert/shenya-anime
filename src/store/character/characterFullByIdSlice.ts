import { getCharacterFullById, getCharacterPictures } from '@/api/character.client';
import { RootState } from '@/app/store';
import { CharacterFull, JikanImages } from '@/models';
import { FetchStatus } from '@/types';
import {
  AsyncThunk,
  CaseReducer,
  createAsyncThunk,
  createSlice,
  Draft,
} from '@reduxjs/toolkit';

type DataKeys = Exclude<keyof CharacterFullState, 'isLoading' | 'error'>;

interface CharacterFullState {
  item: CharacterFull | null;
  pictures: JikanImages[];
  status: Partial<Record<DataKeys, FetchStatus>>;
}

const initialState: CharacterFullState = {
  item: null,
  pictures: [],
  status: {},
};

const characterFullByIdSlice = createSlice({
  name: 'character-full',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleAsync = <
      K extends DataKeys,
      Returned extends CharacterFullState[K],
      ThunkArg = void,
      ThunkConfig extends {} = {},
    >(
      key: K,
      thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
      onFulfilled?: CaseReducer<Draft<CharacterFullState>, ReturnType<typeof thunk.fulfilled>>,
    ) => {
      builder
        .addCase(thunk.pending, (state) => {
          if (key === 'item') {
            const newStatus: CharacterFullState['status'] = {
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

    handleAsync('item', fetchCharacterFullById);
    handleAsync('pictures', fetchCharacterPictures);
  },
});

export default characterFullByIdSlice.reducer;

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
      const id: number | undefined = getState().characterFullById.item?.mal_id;
      if (!id) return rejectWithValue('Character ID is missing');
      return callback(id, arg, signal);
    },
  );
}

export const fetchCharacterFullById = createAsyncThunk<CharacterFull, number>(
  'character-full/fetchFullById',
  async (id, { signal }) => {
    return (await getCharacterFullById(id, signal)).data;
  },
);

export const fetchCharacterPictures = createMangaThunkWithId<JikanImages[]>(
  'character-full/fetchPictures',
  (id, _, signal) => getCharacterPictures(id, signal).then((res) => res.data),
);
