import { AsyncThunkConfig } from '@/app/appAsyncThunk';
import {
  FetchStatus,
  JikanPaginationBase,
  JikanPaginationPlus,
  JikanResponse,
  NullableFetchStatus,
} from '@/typescript';
import {
  ActionReducerMapBuilder,
  AnyAction,
  AsyncThunk,
  CaseReducer,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';

interface AsyncListBuilderState<T, TPagination extends JikanPaginationBase> {
  items: T[];
  status: NullableFetchStatus;
  prevStatus: NullableFetchStatus;
  pagination: TPagination | null;
}

// export const createAsyncPaginationListBuilder = <
//   T,
//   Returned extends JikanResponse<T[], JikanPaginationPlus>,
//   ThunkArg = undefined,
//   ThunkConfig extends {} = AsyncThunkConfig,
// >(
//   builder: ActionReducerMapBuilder<AsyncListBuilderState<T>>,
//   thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
// ) => {
//   builder.addCase(thunk.pending, (state) => {
//     state.prevStatus = state.status;
//     state.status = FetchStatus.LOADING;
//   });
//   builder.addCase(thunk.fulfilled, (state, action) => {
//     state.prevStatus = state.status;
//     const { data, pagination } = action.payload;
//     state.items = data ? data : [];
//     state.pagination = pagination ? pagination : null;
//     state.status = FetchStatus.SUCCESS;
//   });
//   builder.addCase(thunk.rejected, (state, action) => {
//     const meta = (action as typeof action & { meta: { aborted: boolean } }).meta;
//     if (meta.aborted) {
//       state.status = state.prevStatus;
//       return;
//     }
//     state.prevStatus = state.status;
//     state.status = FetchStatus.ERROR;
//   });
// };

type FetchListArgs<T> = {
  params: T;
  append?: boolean;
};

// export const createAsyncListBuilder = <T, Returned extends Draft<T>[], ThunkArg>(
//   builder: ActionReducerMapBuilder<AsyncListBuilderState<T>>,
//   thunk: AsyncThunk<Returned, FetchListArgs<ThunkArg>, AsyncThunkConfig>,
// ) => {

export const createAsyncListBuilder = <
  TItem,
  TPagination extends JikanPaginationPlus,
  TParams extends { page?: number },
>(
  builder: ActionReducerMapBuilder<AsyncListBuilderState<TItem, TPagination>>,
  thunk: AsyncThunk<
    JikanResponse<Draft<TItem>[], Draft<TPagination>>,
    FetchListArgs<TParams>,
    AsyncThunkConfig
  >,
) => {
  builder.addCase(thunk.pending, (state) => {
    state.prevStatus = state.status;
    state.status = FetchStatus.LOADING;
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    const { data, pagination } = action.payload;
    state.items = action.meta.arg.append ? [...state.items, ...data] : data;
    state.pagination = pagination ? pagination : null;
    state.status = FetchStatus.SUCCESS;
  });
  builder.addCase(thunk.rejected, (state, action) => {
    const meta = action.meta;
    if (meta.aborted) {
      state.status = state.prevStatus;
      return;
    }
    state.prevStatus = state.status;
    state.status = FetchStatus.ERROR;
  });
};

//========================================================================================================================================================
interface AsyncListInitialState<I, P> {
  items: I[];
  status: NullableFetchStatus;
  prevStatus: NullableFetchStatus;
  pagination: P | null;
}

type FetchListArgss<T> = {
  params: T;
  append?: boolean;
};

export const createAsyncListBuilder2 = <Item, Pagination extends JikanPaginationBase, Params>(
  builder: ActionReducerMapBuilder<AsyncListInitialState<Item, Pagination>>,
  thunk: AsyncThunk<
    JikanResponse<Draft<Item>[], Draft<Pagination>>,
    FetchListArgss<Params>,
    AsyncThunkConfig
  >,
) => {
  builder.addCase(thunk.pending, (state) => {
    state.prevStatus = state.status;
    state.status = FetchStatus.LOADING;
  });
  // builder.addCase(thunk.fulfilled, asyncListFulfilledReducer<Item, Pagination, Params>);
  // builder.addCase(thunk.fulfilled, createAsyncListFulfilledReducer(thunk));
  builder.addCase(thunk.fulfilled, (state, action) => {
    const { data, pagination } = action.payload;

    state.items = action.meta.arg.append ? [...state.items, ...data] : data;

    state.pagination = pagination ?? null;
    state.status = FetchStatus.SUCCESS;
  });
  builder.addCase(thunk.rejected, (state, action) => {
    const meta = action.meta;
    if (meta.aborted) {
      state.status = state.prevStatus;
      return;
    }
    state.prevStatus = state.status;
    state.status = FetchStatus.ERROR;
  });
};

//========================================================================================================================================================
type ListFulfilledAction<Item, Pagination, Params> = PayloadAction<
  JikanResponse<Draft<Item>[], Draft<Pagination>>,
  string,
  {
    arg: FetchListArgs<Params>;
    requestId: string;
    requestStatus: 'fulfilled';
  }
>;

export const asyncListFulfilledReducer = <Item, Pagination, Params>(
  state: AsyncListInitialState<Draft<Item>, Draft<Pagination>>,
  action: ListFulfilledAction<Item, Pagination, Params>,
) => {
  const { data, pagination } = action.payload;

  state.items = action.meta.arg.append ? [...state.items, ...data] : data;

  state.pagination = pagination ?? null;
  state.status = FetchStatus.SUCCESS;
};

//========================================================================================================================================================
export const createAsyncListFulfilledReducer = <Item, Pagination, Params>(
  thunk: AsyncThunk<JikanResponse<Item[], Pagination>, FetchListArgs<Params>, AsyncThunkConfig>,
) => {
  return (
    state: AsyncListInitialState<Item, Pagination>,
    action: PayloadAction<
      JikanResponse<Item[], Pagination>,
      string,
      {
        arg: FetchListArgs<Params>;
        requestId: string;
        requestStatus: 'fulfilled';
      }
    >,
  ) => {
    const { data, pagination } = action.payload;

    state.items = action.meta.arg.append ? [...state.items, ...data] : data;

    state.pagination = pagination ?? null;
    state.status = FetchStatus.SUCCESS;
  };
};
