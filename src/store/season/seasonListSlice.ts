import { getSeasonsList } from '@/api';
import { SeasonsListData } from '@/models';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  items: SeasonsListData[];
  status: FetchStatus | null;
}

const initialState: InitialState = {
  items: [],
  status: null,
};
const seasonsListSlice = createSlice({
  name: 'seasons-list',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSeasonsList.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(fetchSeasonsList.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(fetchSeasonsList.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.status = FetchStatus.ERROR;
    });
  },
});

export const fetchSeasonsList = createAsyncThunk<SeasonsListData[]>(
  'seasons-list/fetchSeasonsListData',
  async () => (await getSeasonsList()).data,
);

export default seasonsListSlice.reducer;
