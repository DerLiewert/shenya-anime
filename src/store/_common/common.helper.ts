import { AbortedAction } from '@/app/appAsyncThunk';
import { FetchStatus, NullableFetchStatus } from '@/typescript';
import { AnyAction } from '@reduxjs/toolkit';

export interface SingleStatusState {
  status: NullableFetchStatus;
  prevStatus: NullableFetchStatus;
}

export interface KeyedStatusState {
  status: MultiStatus;
  prevStatus: MultiStatus;
}

type MultiStatus<K extends PropertyKey = PropertyKey> = {
  [P in K]?: NullableFetchStatus;
};

//================== Pending ==================//
export const handleAsyncPending = (state: SingleStatusState) => {
  state.prevStatus = state.status;
  state.status = FetchStatus.LOADING;
};

//================== Fulfilled ==================//
export const handleAsyncFulfilledItem = <T>(
  state: SingleStatusState & { item: T },
  action: AnyAction,
) => {
  state.prevStatus = state.status;
  state.item = action.payload;
  state.status = FetchStatus.SUCCESS;
};

export const handleAsyncFulfilledItems = <T>(
  state: SingleStatusState & { items: T },
  action: AnyAction,
) => {
  state.prevStatus = state.status;
  state.items = action.payload;
  state.status = FetchStatus.SUCCESS;
};

//================== Rejected ==================//
export const handleAsyncRejected = (state: SingleStatusState, action: AbortedAction) => {
  if (action.meta?.aborted) {
    state.status = state.prevStatus;
    return;
  }
  state.prevStatus = state.status;
  state.status = FetchStatus.ERROR;
};
