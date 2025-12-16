import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, Draft } from '@reduxjs/toolkit';
import { AsyncThunkConfig, FetchStatus, NullableFetchStatus } from '@/typescript';

type AsyncThunkStatus<K extends string | number | symbol> = Record<K, NullableFetchStatus>;

export const bilderHandleAsync = <
  State extends {
    item: any,
    status: Partial<AsyncThunkStatus<keyof State>>;
  } & Record<string, any>,
  DataKeys extends Exclude<keyof State, 'status'> = Exclude<keyof State, 'status'>,
>(
  builder: ActionReducerMapBuilder<State>,
  initialState: State,
) => {
  const prevStatus = new Map<keyof State, NullableFetchStatus>();

  return function handleAsync<
    K extends DataKeys,
    Returned extends State[K],
    ThunkArg = undefined,
    ThunkConfig extends {} = AsyncThunkConfig,
  >(
    key: K,
    thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
    onFulfilled?: CaseReducer<Draft<State>, ReturnType<typeof thunk.fulfilled>>,
  ) {
    builder
      .addCase(thunk.pending, (state) => {
        const status = state.status as AsyncThunkStatus<K>;
        prevStatus.set(key, status[key]);

        if (key === 'item') {
          const newStatus = {
            item: FetchStatus.LOADING,
          };
          Object.assign(state, initialState);
          state.status = newStatus as any;
        } else {
          status[key] = FetchStatus.LOADING;
        }
      })
      .addCase(thunk.fulfilled, (state, action) => {
        const status = state.status as AsyncThunkStatus<K>;
        prevStatus.set(key, status[key]);
        if (onFulfilled) {
          onFulfilled(state as Draft<Draft<State>>, action);
        } else if (action.payload !== undefined) {
          (state as State)[key] = action.payload;
        }
        status[key] = FetchStatus.SUCCESS;
      })
      .addCase(thunk.rejected, (state, action) => {
        const status = state.status as AsyncThunkStatus<K>;
        const meta = (action as typeof action & { meta: { aborted: boolean } }).meta;
        if (meta.aborted) {
          status[key] = prevStatus.get(key);
          return;
        }
        prevStatus.set(key, status[key]);
        status[key] = FetchStatus.ERROR;
      });
  };
};
