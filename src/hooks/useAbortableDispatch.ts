import { useAppDispatch } from '@/app/hooks';
import { RootState } from '@/app/store';
import { AsyncThunk } from '@reduxjs/toolkit';
import { useEffect } from 'react';

type SpecialConfig = { state: RootState; rejectValue: string };

export function useAbortableDispatch<Returned, Arg, Config extends SpecialConfig = SpecialConfig>(
  actionCreator: AsyncThunk<Returned, Arg, Config>,
  payload?: Arg,
  shouldFetch?: boolean,
): void;

export function useAbortableDispatch<Returned, Arg>(
  actionCreator: AsyncThunk<Returned, Arg, {}>,
  payload?: Arg,
  shouldFetch?: boolean,
): void;

export function useAbortableDispatch<Returned, Arg>(
  actionCreator: AsyncThunk<Returned, Arg, any>,
  payload: Arg & undefined,
  shouldFetch: boolean = true,
): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!shouldFetch) return;

    const controller = new AbortController();
    dispatch(actionCreator(payload, { signal: controller.signal }));

    return () => {
      controller.abort();
    };
  }, [dispatch, actionCreator, payload, shouldFetch]);
}

// export function useAbortableDispatch<
//   Returned,
//   Arg,
//   Config extends {} = {}
// >(
//   thunk: AsyncThunk<Returned, Arg, Config>,
//   payload?: Arg,
//   shouldFetch: boolean = true,
// ): void {

// export function useAbortableDispatch<T extends AsyncThunk<any, any, ExtractThunkConfig<T>>>(
//   actionCreator: T,
//   payload?: ExtractThunkArg<T>,
//   shouldFetch: boolean = true,
// ): void {
