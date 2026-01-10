import { AnyAction, AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';

export type AsyncThunkConfig = { state: RootState; rejectValue: string; dispatch: AppDispatch };

export type AppAsyncThunk<Returned, Arg = any> = AsyncThunk<Returned, Arg, AsyncThunkConfig>;
export const createAppAsyncThunk = createAsyncThunk.withTypes<AsyncThunkConfig>();

export type AbortedAction = AnyAction & { meta: { aborted: boolean } };
// export type AppAsyncThunk<Returned, Arg extends FetchListArgs<Returned>> = AsyncThunk<Returned, Arg, AsyncThunkConfig>;
