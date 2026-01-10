import { AppAsyncThunk } from '@/app/appAsyncThunk';
import { FetchStatus } from '@/typescript';
import { ActionReducerMapBuilder, CaseReducer } from '@reduxjs/toolkit';
import { KeyedStatusState } from './common.helper';

export interface EntityDetailsStateBase<Item> extends KeyedStatusState {
  item: Item | null;
}

export const createEntityDetailsState = <Item>(): EntityDetailsStateBase<Item> => ({
  item: null,
  status: {},
  prevStatus: {},
});

export const entityDetailsBuilder = <
  Item,
  State extends EntityDetailsStateBase<Item> = EntityDetailsStateBase<Item>,
  AsyncKeys extends keyof State = keyof State,
>(
  builder: ActionReducerMapBuilder<State>,
  initialState: State,
) => {
  return function handleAsync<K extends AsyncKeys, Returned extends State[K], ThunkArg>(
    key: K,
    thunk: AppAsyncThunk<NonNullable<Returned>, ThunkArg>,
    onFulfilled?: CaseReducer<State, ReturnType<typeof thunk.fulfilled>>,
  ) {
    builder.addCase(thunk.pending, (state) => {
      const status = state.status;
      const prevStatus = state.prevStatus;

      if (key === 'item') {
        const newPrevStatus = {
          item: state.prevStatus.item,
        };
        const newStatus = {
          item: FetchStatus.LOADING,
        };
        Object.assign(state, initialState);
        state.status = newStatus;
        state.prevStatus = newPrevStatus;
      } else {
        prevStatus[key] = status[key];
        status[key] = FetchStatus.LOADING;
      }
    });

    builder.addCase(thunk.fulfilled, (state, action) => {
      const status = state.status;
      const prevStatus = state.prevStatus;
      prevStatus[key] = status[key];

      if (onFulfilled) {
        onFulfilled(state, action);
      } else if (action.payload !== undefined) {
        (state as State)[key] = action.payload;
      }

      status[key] = FetchStatus.SUCCESS;
    });

    builder.addCase(thunk.rejected, (state, action) => {
      const status = state.status;
      const prevStatus = state.prevStatus;
      const meta = (action as typeof action & { meta: { aborted: boolean } }).meta;
      if (meta.aborted) {
        status[key] = prevStatus[key];
        return;
      }
      prevStatus[key] = status[key];
      status[key] = FetchStatus.ERROR;
    });
  };
};
