import { AppDispatch, RootState } from '@/app/store';
import { AsyncThunk } from '@reduxjs/toolkit';

export type AsyncThunkConfig = { state: RootState; rejectValue: string; dispatch: AppDispatch };

export type CustomAsyncThunk<Returned, Arg = undefined> = AsyncThunk<
  Returned,
  Arg,
  AsyncThunkConfig
>;
