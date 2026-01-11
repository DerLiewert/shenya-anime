import { getPersonFullById, getPersonPictures } from '@/api';
import { createSlice } from '@reduxjs/toolkit';
import { JikanImages, PersonFull } from '@/typescript';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import {
  createEntityDetailsState,
  createPersonThunkWithId,
  entityDetailsBuilder,
  EntityDetailsStateBase,
} from '../_common';

interface PersonFullState extends EntityDetailsStateBase<PersonFull> {
  pictures: JikanImages[];
}

const initialState: PersonFullState = {
  ...createEntityDetailsState(),
  pictures: [],
};

const personFullByIdSlice = createSlice({
  name: 'person-full',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleAsync = entityDetailsBuilder(builder, initialState);

    handleAsync('item', fetchPersonFullById);
    handleAsync('pictures', fetchPersonPictures);
  },
});

export default personFullByIdSlice.reducer;

//========================================================================================================================================================
export const fetchPersonFullById = createAppAsyncThunk<PersonFull, number>(
  'person-full/fetchFullById',
  async (id, { signal }) => (await getPersonFullById(id, signal)).data,
);

export const fetchPersonPictures = createPersonThunkWithId<JikanImages[]>(
  'person-full/fetchPictures',
  async (id, _, signal) => (await getPersonPictures(id, signal)).data,
);
