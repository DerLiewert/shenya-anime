import { getSeasonsList } from '@/api';
import { SeasonsListData } from '@/models';
import { FetchStatus } from '@/typescript';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  items: SeasonsListData[];
  status: FetchStatus;
}

const initialState: InitialState = {
  items: [],
  status: FetchStatus.LOADING,
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
    builder.addCase(fetchSeasonsList.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  },
});

export const fetchSeasonsList = createAsyncThunk<SeasonsListData[]>(
  'seasons-list/fetchSeasonsListData',
  async () => {
    return (await getSeasonsList()).data;
  },
);

export default seasonsListSlice.reducer;
