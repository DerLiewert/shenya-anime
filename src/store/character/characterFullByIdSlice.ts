import { createSlice } from '@reduxjs/toolkit';
import { getCharacterFullById, getCharacterPictures } from '@/api';
import { CharacterFull, JikanImages } from '@/typescript';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { createCharacterThunkWithId, createEntityDetailsState, entityDetailsBuilder, EntityDetailsStateBase } from '../_common';

interface CharacterFullState extends EntityDetailsStateBase<CharacterFull> {
  pictures: JikanImages[];
}

const initialState: CharacterFullState = {
  ...createEntityDetailsState(),
  pictures: [],
};

const characterFullByIdSlice = createSlice({
  name: 'character-full',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleAsync = entityDetailsBuilder(builder, initialState);
    handleAsync('item', fetchCharacterFullById);
    handleAsync('pictures', fetchCharacterPictures);
  },
});

export default characterFullByIdSlice.reducer;

//========================================================================================================================================================

export const fetchCharacterFullById = createAppAsyncThunk<CharacterFull, number>(
  'character-full/fetchFullById',
  async (id, { signal }) => (await getCharacterFullById(id, signal)).data,
);

export const fetchCharacterPictures = createCharacterThunkWithId<JikanImages[]>(
  'character-full/fetchPictures',
  async (id, _, signal) => (await getCharacterPictures(id, signal)).data,
);
