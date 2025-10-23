import { AsyncThunkConfig, FetchStatus } from '@/typescript';
import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';

interface BasicState<T> {
  items: T[];
  status: FetchStatus;
}

export const basicBuilder = <T>(builder: ActionReducerMapBuilder<BasicState<T>>) => {
  return function handleAsync<
    Returned extends BasicState<T>['items'],
    ThunkArg = undefined,
    ThunkConfig extends {} = AsyncThunkConfig,
  >(thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>) {
    builder.addCase(thunk.pending, (state) => {
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      (state as BasicState<T>).items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(thunk.rejected, (state) => {
      state.status = FetchStatus.ERROR;
    });
  };
};
