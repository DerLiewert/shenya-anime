import { getProducerFullById } from '@/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProducerFull, FetchStatus } from '@/typescript';

interface ProducerFullState {
  item: ProducerFull | null;
  status: FetchStatus | null;
}

const initialState: ProducerFullState = {
  item: null,
  status: null,
};

const producerFullByIdSlice = createSlice({
  name: 'producer-full',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducerFullById.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchProducerFullById.fulfilled, (state, action) => {
      state.item = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchProducerFullById.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export default producerFullByIdSlice.reducer;

//========================================================================================================================================================
export const fetchProducerFullById = createAsyncThunk<ProducerFull, number>(
  'producer-full/fetchProducerFullById',
  async (id, { signal }) => (await getProducerFullById(id, signal)).data,
);
