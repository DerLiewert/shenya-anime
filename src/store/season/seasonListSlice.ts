import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getSeasonsList } from '@/api';
import { SeasonsListData } from '@/typescript';
import { asyncListBaseBuilder, createAsyncListBaseState } from '../_common';

//============ Thunk ============//
const initialState = createAsyncListBaseState<SeasonsListData>();

export const seasonsListSlice = createSlice({
  name: 'seasons-list',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    asyncListBaseBuilder(builder, fetchSeasonsList);
  },
});

export default seasonsListSlice.reducer;

//============ Slice ============//
export const fetchSeasonsList = createAppAsyncThunk<SeasonsListData[]>(
  'seasons-list/fetchSeasonsListData',
  async () => (await getSeasonsList()).data,
);
