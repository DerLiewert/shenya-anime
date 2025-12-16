import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCharacterFullById, getCharacterPictures } from '@/api';
import { CharacterFull, JikanImages, FetchStatus } from '@/typescript';
import { createCharacterThunkWithId, bilderHandleAsync } from '@/utils';

type DataKeys = Exclude<keyof CharacterFullState, 'status'>;

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
    const handleAsync = bilderHandleAsync(builder, initialState);
    handleAsync('item', fetchCharacterFullById);
    handleAsync('pictures', fetchCharacterPictures);
  },
});

export default characterFullByIdSlice.reducer;

//========================================================================================================================================================

export const fetchCharacterFullById = createAsyncThunk<CharacterFull, number>(
  'character-full/fetchFullById',
  async (id, { signal }) => (await getCharacterFullById(id, signal)).data,
);

export const fetchCharacterPictures = createCharacterThunkWithId<JikanImages[]>(
  'character-full/fetchPictures',
  async (id, _, signal) => (await getCharacterPictures(id, signal)).data,
);
