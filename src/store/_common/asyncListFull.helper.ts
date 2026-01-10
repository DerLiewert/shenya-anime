import { AsyncThunkConfig } from '@/app/appAsyncThunk';
import { FetchStatus, JikanPaginationBase, JikanResponse } from '@/typescript';
import { ActionReducerMapBuilder, AsyncThunk, Draft } from '@reduxjs/toolkit';
import { AsyncListBaseState, createAsyncListBaseState } from '.';
import { handleAsyncPending, handleAsyncRejected } from './common.helper';

export type FetchListArgs<T> = {
  params: T;
  append?: boolean;
};

export interface AsyncListFullState<Item, Pagination extends JikanPaginationBase>
  extends AsyncListBaseState<Item> {
  pagination: Pagination | null;
}

export const createAsyncListFullState = <
  Item,
  Pagination extends JikanPaginationBase = JikanPaginationBase,
>(): AsyncListFullState<Item, Pagination> => ({
  ...createAsyncListBaseState(),
  pagination: null,
});

export const asyncListFullBuilder = <Item, Pagination extends JikanPaginationBase, Params>(
  builder: ActionReducerMapBuilder<AsyncListFullState<Item, Pagination>>,
  thunk: AsyncThunk<
    JikanResponse<Draft<Item>[], Draft<Pagination>>,
    FetchListArgs<Params>,
    AsyncThunkConfig
  >,
) => {
  builder.addCase(thunk.pending, handleAsyncPending);

  builder.addCase(thunk.fulfilled, (state, action) => {
    const { data, pagination } = action.payload;

    state.items = action.meta.arg.append ? [...state.items, ...data] : data;

    state.pagination = pagination ?? null;
    state.status = FetchStatus.SUCCESS;
  });

  builder.addCase(thunk.rejected, handleAsyncRejected);
};
