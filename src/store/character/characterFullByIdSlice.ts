import { getCharacterFullById, getCharacterPictures } from '@/api/character.client';
import { CharacterFull, JikanImages } from '@/models';
import { FetchStatus } from '@/typescript';
import { createCharacterThunkWithId, createHandle } from '@/utils';
import { AsyncThunk, CaseReducer, createAsyncThunk, createSlice, Draft } from '@reduxjs/toolkit';

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
    const handleAsync = createHandle(builder, initialState);
    handleAsync('item', fetchCharacterFullById);
    handleAsync('pictures', fetchCharacterPictures);
  },
});

export default characterFullByIdSlice.reducer;

//========================================================================================================================================================

export const fetchCharacterFullById = createAsyncThunk<CharacterFull, number>(
  'character-full/fetchFullById',
  async (id, { signal }) => {
    return (await getCharacterFullById(id, signal)).data;
  },
);

export const fetchCharacterPictures = createCharacterThunkWithId<JikanImages[]>(
  'character-full/fetchPictures',
  (id, _, signal) => getCharacterPictures(id, signal).then((res) => res.data),
);
