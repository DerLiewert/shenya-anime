import { getPersonFullById, getPersonPictures } from '@/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { JikanImages, PersonFull, FetchStatus } from '@/typescript';
import { bilderHandleAsync, createPersonThunkWithId } from '@/utils';

type DataKeys = Exclude<keyof PersonFullState, 'status'>;

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
    const handleAsync = bilderHandleAsync(builder, initialState);

    handleAsync('item', fetchPersonFullById);
    handleAsync('pictures', fetchPersonPictures);
  },
});

export default personFullByIdSlice.reducer;

//========================================================================================================================================================
export const fetchPersonFullById = createAsyncThunk<PersonFull, number>(
  'person-full/fetchFullById',
  async (id, { signal }) => (await getPersonFullById(id, signal)).data,
);

export const fetchPersonPictures = createPersonThunkWithId<JikanImages[]>(
  'person-full/fetchPictures',
  async (id, _, signal) => (await getPersonPictures(id, signal)).data,
);
