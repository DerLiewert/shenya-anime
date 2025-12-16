import { ActionReducerMapBuilder, AsyncThunk, Draft } from '@reduxjs/toolkit';
import {
  AsyncThunkConfig,
  FetchStatus,
  JikanPaginationPlus,
  JikanResponse,
  NullableFetchStatus,
} from '@/typescript';

interface BasicState<T> {
  items: T[];
  status: NullableFetchStatus;
  prevStatus: NullableFetchStatus;
}

export const basicBuilder = <T>(builder: ActionReducerMapBuilder<BasicState<T>>) => {
  let prevStatus: NullableFetchStatus = null;
  return function handleAsync<
    Returned extends Draft<T>[],
    ThunkArg = undefined,
    ThunkConfig extends {} = AsyncThunkConfig,
  >(thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>) {
    builder.addCase(thunk.pending, (state) => {
      prevStatus = state.status;
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      prevStatus = state.status;
      state.items = action.payload;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(thunk.rejected, (state, action) => {
      const meta = (action as typeof action & { meta: { aborted: boolean } }).meta;
      if (meta.aborted) {
        state.status = prevStatus;
        return;
      }
      prevStatus = state.status;
      state.status = FetchStatus.ERROR;
    });
  };
};

//========================================================================================================================================================
interface BasicStatePlus<T> {
  items: T[];
  pagination: JikanPaginationPlus | null;
  status: NullableFetchStatus;
}

export const basicBuilderPlus = <T>(builder: ActionReducerMapBuilder<BasicStatePlus<T>>) => {
  let prevStatus: NullableFetchStatus = null;
  return function handleAsync<
    Returned extends JikanResponse<Draft<T>[], JikanPaginationPlus>,
    ThunkArg = undefined,
    ThunkConfig extends {} = AsyncThunkConfig,
  >(thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>) {
    builder.addCase(thunk.pending, (state) => {
      prevStatus = state.status;
      state.status = FetchStatus.LOADING;
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      prevStatus = state.status;
      const { data, pagination } = action.payload;
      state.items = data ? data : [];
      state.pagination = pagination ? pagination : null;
      state.status = FetchStatus.SUCCESS;
    });
    builder.addCase(thunk.rejected, (state, action) => {
      const meta = (action as typeof action & { meta: { aborted: boolean } }).meta;
      if (meta.aborted) {
        state.status = prevStatus;
        return;
      }
      prevStatus = state.status;
      state.status = FetchStatus.ERROR;
    });
  };
};





//========================================================================================================================================================
interface CommonState {
  status: NullableFetchStatus;
  prevStatus: NullableFetchStatus;
}

type DataKeys = Exclude<keyof CommonStatePlus, keyof CommonStatePlus>;
interface CommonStatePlus {
  [x: string]: any,
  status: Partial<Record<DataKeys, FetchStatus>>;
  prevStatus: NullableFetchStatus;
}

interface C extends CommonStatePlus {
  d: number
}

const d: C = {
  d: 0,
  status: [],
  prevStatus: undefined
}
