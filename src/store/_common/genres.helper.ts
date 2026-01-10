import { AppAsyncThunk } from '@/app/appAsyncThunk';
import { FetchStatus, Genre } from '@/typescript';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { AsyncListBaseState, createAsyncListBaseState } from './asyncListBase.helper';
import { handleAsyncPending, handleAsyncRejected } from './common.helper';

export const createAsyncGenresState = (): AsyncListBaseState<Genre> => ({
  ...createAsyncListBaseState<Genre>(),
});

export const asyncGenresBuilder = (
  builder: ActionReducerMapBuilder<AsyncListBaseState<Genre>>,
  thunk: AppAsyncThunk<Genre[]>,
) => {
  builder.addCase(thunk.pending, handleAsyncPending);

  builder.addCase(thunk.fulfilled, (state, action) => {
    state.prevStatus = state.status;
    state.items = action.payload.sort((obj1, obj2) => {
      if (obj1.name < obj2.name) return -1;
      if (obj1.name > obj2.name) return 1;
      return 0;
    });
    state.status = FetchStatus.SUCCESS;
  });

  builder.addCase(thunk.rejected, handleAsyncRejected);
};
