import { getPersonFullById, getPersonPictures } from '@/api/client/person.client';
import { JikanImages, PersonFull } from '@/models';
import { FetchStatus } from '@/typescript';
import { createHandle, createPersonThunkWithId } from '@/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
    const handleAsync = createHandle(builder, initialState);

    handleAsync('item', fetchPersonFullById);
    handleAsync('pictures', fetchPersonPictures);
  },
});

export default personFullByIdSlice.reducer;

//========================================================================================================================================================
export const fetchPersonFullById = createAsyncThunk<PersonFull, number>(
  'person-full/fetchFullById',
  async (id, { signal }) => {
    return (await getPersonFullById(id, signal)).data;
  },
);

export const fetchPersonPictures = createPersonThunkWithId<JikanImages[]>(
  'person-full/fetchPictures',
  (id, _, signal) => getPersonPictures(id, signal).then((res) => res.data),
);
