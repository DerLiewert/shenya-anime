import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, Draft } from '@reduxjs/toolkit';
import { AsyncThunkConfig, FetchStatus } from '@/typescript';

export const createHandle = <
  State extends {
    status: Partial<Record<keyof State, FetchStatus>>;
  } & Record<string, any>,
  DataKeys extends Exclude<keyof State, 'status'> = Exclude<keyof State, 'status'>,
>(
  builder: ActionReducerMapBuilder<State>,
  initialState: State,
) => {
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
        if (key === 'item') {
          const newStatus = {
            item: FetchStatus.LOADING,
          };
          Object.assign(state, initialState);
          state.status = newStatus as any;
        } else {
          (state.status as Record<K, FetchStatus>)[key] = FetchStatus.LOADING;
        }
      })
      .addCase(thunk.fulfilled, (state, action) => {
        if (onFulfilled) {
          onFulfilled(state as Draft<Draft<State>>, action);
        } else if (action.payload !== undefined) {
          (state as State)[key] = action.payload;
        }
        (state.status as Record<K, FetchStatus>)[key] = FetchStatus.SUCCESS;
      })
      .addCase(thunk.rejected, (state, action) => {
        const meta = (action as typeof action & { meta: { aborted: boolean } }).meta;
        if (meta.aborted) return;
        (state.status as Record<K, FetchStatus>)[key] = FetchStatus.ERROR;
      });
  };
};
