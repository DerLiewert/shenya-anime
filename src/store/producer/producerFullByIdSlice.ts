import { getProducerFullById } from '@/api';
import { createSlice } from '@reduxjs/toolkit';
import { ProducerFull } from '@/typescript';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { createEntityDetailsState, entityDetailsBuilder, EntityDetailsStateBase } from '../_common';


/* Сразу на основе EntityDetailsState, на случай, если добавится доп. инфо, например pictures: [] */
interface ProducerFullState extends EntityDetailsStateBase<ProducerFull> {}

const initialState: ProducerFullState = {
  ...createEntityDetailsState(),
};

const producerFullByIdSlice = createSlice({
  name: 'producer-full',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleAsync = entityDetailsBuilder(builder, initialState);
    handleAsync('item', fetchProducerFullById);
  },
});

export default producerFullByIdSlice.reducer;

//========================================================================================================================================================
export const fetchProducerFullById = createAppAsyncThunk<ProducerFull, number>(
  'producer-full/fetchProducerFullById',
  async (id, { signal }) => (await getProducerFullById(id, signal)).data,
);
