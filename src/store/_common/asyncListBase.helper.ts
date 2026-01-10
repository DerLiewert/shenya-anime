import { AsyncThunkConfig } from '@/app/appAsyncThunk';
import { FetchStatus } from '@/typescript';
import { ActionReducerMapBuilder, AsyncThunk, Draft } from '@reduxjs/toolkit';
import { handleAsyncPending, handleAsyncRejected, SingleStatusState } from './common.helper';

export interface AsyncListBaseState<Item> extends SingleStatusState {
  items: Item[];
}

export const createAsyncListBaseState = <Item>(): AsyncListBaseState<Item> => ({
  items: [],
  status: null,
  prevStatus: null,
});

export const asyncListBaseBuilder = <T, Returned extends Draft<T>[], ThunkArg>(
  builder: ActionReducerMapBuilder<AsyncListBaseState<T>>,
  thunk: AsyncThunk<Returned, ThunkArg, AsyncThunkConfig>,
) => {
  builder.addCase(thunk.pending, handleAsyncPending);

  builder.addCase(thunk.fulfilled, (state, action) => {
    state.prevStatus = state.status;
    state.items = action.payload;
    state.status = FetchStatus.SUCCESS;
  });

  builder.addCase(thunk.rejected, handleAsyncRejected);
};
