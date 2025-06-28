import { useAppDispatch } from '@/app/hooks';
import { AsyncThunk } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';

// export function useAbortableDispatch<P>(
//   actionCreator: (payload: P) => any,
//   payload: P,
//   shouldFetch = true,
// ) {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (!shouldFetch) return;

//     const controller = new AbortController();
//     dispatch(actionCreator(payload));

//     return () => {
//       controller.abort();
//     };
//   }, [dispatch, actionCreator, payload, shouldFetch]);
// }

// export function useAbortableDispatch<Thunk extends AsyncThunk<any, any, any>>(
//   actionCreator: Thunk,
//   payload?: Parameters<Thunk>[0],
//   shouldFetch: boolean = true,
// ): void {
//   const dispatch = useAppDispatch();
//   const didRun = useRef(false);

//   useEffect(() => {
//     if (didRun.current || !shouldFetch) return;

//     didRun.current = true;
//     const controller = new AbortController();
//     dispatch(actionCreator(payload, { signal: controller.signal }));

//     return () => {
//       console.log('abort');
//       controller.abort();
//     };
//   }, [dispatch, actionCreator, payload, shouldFetch]);
// }

export function useAbortableDispatch<Thunk extends AsyncThunk<any, any, any>>(
  actionCreator: Thunk,
  payload?: Parameters<Thunk>[0],
  shouldFetch: boolean = true,
): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!shouldFetch) return;

    const controller = new AbortController();
    dispatch(actionCreator(payload, { signal: controller.signal }));

    return () => {
      // console.log('abort');
      controller.abort();
    };
  }, [dispatch, actionCreator, payload, shouldFetch]);
}
