import { useAppDispatch } from '@/app/hooks';
import { AsyncThunkConfig } from '@/typescript';
import { AsyncThunk, AsyncThunkAction } from '@reduxjs/toolkit';
import React, { useCallback, useEffect, useRef } from 'react';

// export function useAbortableDispatch<
//   Returned,
//   Arg,
//   Config extends AsyncThunkConfig = AsyncThunkConfig,
// >(actionCreator: AsyncThunk<Returned, Arg, Config>, payload?: Arg, shouldFetch?: boolean): void;

// export function useAbortableDispatch<Returned, Arg>(
//   actionCreator: AsyncThunk<Returned, Arg, {}>,
//   payload?: Arg,
//   shouldFetch?: boolean,
// ): void;

// export function useAbortableDispatch<Returned, Arg>(
//   actionCreator: AsyncThunk<Returned, Arg, any>,
//   payload: Arg & undefined,
//   shouldFetch: boolean = true,
// ): void {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (!shouldFetch) return;

//     let isDone = false;
//     const controller = new AbortController();

//     dispatch(actionCreator(payload, { signal: controller.signal }))
//       .unwrap()
//       .finally(() => {
//         isDone = true;
//       });

//     return () => {
//       if (!isDone) controller.abort();
//     };
//   }, [dispatch, actionCreator, payload, shouldFetch]);
// }

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

// export function useAbortableDispatch() {
//   const dispatch = useAppDispatch();
//   const controllersRef = useRef<AbortController[]>([]);
//   console.log('useAbortableDispatch');
//   useEffect(() => {
//     return () => {
//       controllersRef.current.forEach((c) => c.abort());
//       controllersRef.current = [];
//     };
//   }, []);

//   function callAbortable<Returned, Arg, Config extends AsyncThunkConfig = AsyncThunkConfig>(
//     thunk: AsyncThunk<Returned, Arg, Config>,
//     arg?: Arg,
//   ): ReturnType<ReturnType<typeof thunk>>;
//   function callAbortable<Returned, Arg>(
//     thunk: AsyncThunk<Returned, Arg, {}>,
//     arg?: Arg,
//   ): ReturnType<ReturnType<typeof thunk>>;

//   function callAbortable(thunk: AsyncThunk<any, any, any>, arg?: any): any {
//     const controller = new AbortController();
//     controllersRef.current.push(controller);

//     const action = thunk(arg, { signal: controller.signal });
//     const promise = dispatch(action);

//     promise.finally(() => {
//       controllersRef.current = controllersRef.current.filter((c) => c !== controller);
//     });

//     return promise;
//   }

//   // Возвращаем стабилизированную ссылку
//   return useCallback(callAbortable, [dispatch]);
// }

//========================================================================================================================================================

// type AbortableDispatch = <
//   TReturned,
//   TArg,
//   TConfig extends AsyncThunkConfig
// >(
//   thunk: AsyncThunk<TReturned, TArg, TConfig>,
//   arg?: TArg,
// ) => ReturnType<ReturnType<typeof thunk>>;

// type AbortableDispatch = <
//   TReturned,
//   TArg,
//   TConfig extends AsyncThunkConfig = AsyncThunkConfig
// >(
//   thunk: AsyncThunk<TReturned, TArg, TConfig>,
//   arg?: TArg,
// ) => ReturnType<ReturnType<AsyncThunk<TReturned, TArg, TConfig>>>;

//========================================================================================================================================================

// type AbortableDispatch = <T extends AsyncThunk<any, any, any>>(
//   thunk: T,
//   arg?: Parameters<T>[0],
// ) => ReturnType<ReturnType<T>>;

type AbortableDispatch1 = <Returned, Arg extends any, ThunkApiConfig extends {} = AsyncThunkConfig>(
  thunk: AsyncThunk<Returned, Arg, ThunkApiConfig>,
  arg?: Parameters<AsyncThunk<Returned, Arg, ThunkApiConfig>>[0],
) => AsyncThunkAction<Returned, Arg, ThunkApiConfig>;
// ) => ReturnType<ReturnType<typeof thunk>>;

export const useAbortableDispatch1 = () => {
  const dispatch = useAppDispatch();
  const controllersRef = useRef<AbortController[]>([]);

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current = [];
    };
  }, []);

  return useCallback<AbortableDispatch1>(
    (thunk, arg) => {
      console.log('controllersRef.current', controllersRef.current);
      const controller = new AbortController();
      controllersRef.current.push(controller);
      const action = thunk(arg as any, { signal: controller.signal });
      const promise = dispatch(action as any);
      promise.finally(() => {
        controllersRef.current = controllersRef.current.filter((c) => c !== controller);
      });
      return promise;
    },
    [dispatch],
  );
};

// type AbortableDispatch = <
//   Returned,
//   Arg,
//   ThunkConfig extends AsyncThunkConfig
// >(
//   thunk: AsyncThunk<Returned, Arg, ThunkConfig>,
//   arg: Arg | undefined
// ) => ReturnType<ReturnType<typeof thunk>>;

// export function useAbortableDispatch(): AbortableDispatch {
//   const dispatch = useAppDispatch();
//   const controllersRef = useRef<AbortController[]>([]);

//   useEffect(() => {
//     return () => {
//       controllersRef.current.forEach((c) => c.abort());
//       controllersRef.current = [];
//     };
//   }, []);

//   return useCallback(
//     (thunk, arg) => {
//       const controller = new AbortController();
//       controllersRef.current.push(controller);

//       const action = thunk(arg, { signal: controller.signal });
//       const promise = dispatch(action) as ReturnType<ReturnType<typeof thunk>>;

//       promise.finally(() => {
//         controllersRef.current = controllersRef.current.filter(
//           (c) => c !== controller
//         );
//       });

//       return promise;
//     },
//     [dispatch],
//   );
// }

//  const dispatch = useAppDispatch();
//   const controllersRef = useRef<AbortController[]>([]);

//   useEffect(() => {
//     return () => {
//       controllersRef.current.forEach((c) => c.abort());
//       controllersRef.current = [];
//     };
//   }, []);

//   const callAbortable = useCallback(
//     <Returned, Arg, Config extends AsyncThunkConfig = AsyncThunkConfig>(
//       thunk: AsyncThunk<Returned, Arg, Config>,
//       arg?: Arg,
//     ): ReturnType<ReturnType<typeof thunk>> => {
//       const controller = new AbortController();
//       controllersRef.current.push(controller);

//       const action = thunk(arg as Arg, { signal: controller.signal });
//       const promise = dispatch(action) as ReturnType<ReturnType<typeof thunk>>;

//       promise.finally(() => {
//         controllersRef.current = controllersRef.current.filter(
//           (c) => c !== controller,
//         );
//       });

//       return promise;
//     },
//     [dispatch],
//   );

//   return callAbortable;
// }



//========================================================================================================================================================

type AbortableDispatchFn  = <
  Returned,
  Arg,
  ThunkApiConfig extends {} = AsyncThunkConfig
>(
  thunk: AsyncThunk<Returned, Arg, ThunkApiConfig>,
  arg?: Parameters<AsyncThunk<Returned, Arg, ThunkApiConfig>>[0],
  key?: string
) => AsyncThunkAction<Returned, Arg, ThunkApiConfig>;

// let uniqueId = 0;
// const thunkKeyMap = new WeakMap<Function, string>();

// export const useAbortableDispatch = () => {
//   const dispatch = useAppDispatch();
//   const controllersRef = useRef<Map<string, AbortController>>(new Map());

//   useEffect(() => {
//     return () => {
//       controllersRef.current.forEach((c) => c.abort());
//       controllersRef.current.clear();
//     };
//   }, []);

//   return useCallback<AbortableDispatch>(
//     (thunk, arg, key) => {
//       let resolvedKey =
//         key ??
//         ((thunk as any).typePrefix ||
//         thunk.name);

//       if (!resolvedKey) {
//         if (!thunkKeyMap.has(thunk)) {
//           thunkKeyMap.set(thunk, `anonThunk-${uniqueId++}`);
//         }
//         resolvedKey = thunkKeyMap.get(thunk)!;
//       }

//       // отменяем прошлый с этим ключом
//       controllersRef.current.get(resolvedKey)?.abort();

//       // создаём новый
//       const controller = new AbortController();
//       controllersRef.current.set(resolvedKey, controller);

//       const action = thunk(arg as any, { signal: controller.signal });
//       const promise = dispatch(action as any);

//       promise.finally(() => {
//         if (controllersRef.current.get(resolvedKey) === controller) {
//           controllersRef.current.delete(resolvedKey);
//         }
//       });

//       return promise;
//     },
//     [dispatch],
//   );
// };

type AbortableDispatch = AbortableDispatchFn & {
  abort: (keyOrThunk?: string | Function) => void;
};

let uniqueId = 0;
const thunkKeyMap = new WeakMap<Function, string>();

export const useAbortableDispatch = () => {
  const dispatch = useAppDispatch();
  const controllersRef = useRef<Map<string, AbortController>>(new Map());

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current.clear();
    };
  }, []);

  const abortableDispatch = useCallback(
    (<Returned, Arg, ThunkApiConfig extends {} = AsyncThunkConfig>(
      thunk: AsyncThunk<Returned, Arg, ThunkApiConfig>,
      arg?: Parameters<AsyncThunk<Returned, Arg, ThunkApiConfig>>[0],
      key?: string,
    ) => {
      let resolvedKey =
        key ??
        (thunk.typePrefix ||
        thunk.name);

      if (!resolvedKey) {
        if (!thunkKeyMap.has(thunk)) {
          thunkKeyMap.set(thunk, `anonThunk-${uniqueId++}`);
        }
        resolvedKey = thunkKeyMap.get(thunk)!;
      }

      // отменяем прошлый с этим ключом
      controllersRef.current.get(resolvedKey)?.abort();

      // создаём новый
      const controller = new AbortController();
      controllersRef.current.set(resolvedKey, controller);

      const action = thunk(arg as any, { signal: controller.signal });
      const promise = dispatch(action as any);

      promise.finally(() => {
        if (controllersRef.current.get(resolvedKey) === controller) {
          controllersRef.current.delete(resolvedKey);
        }
      });

      return promise;
    }) as AbortableDispatch,
    [dispatch],
  );

  // 🔹 Добавляем метод abort вручную
  (abortableDispatch as any).abort = (keyOrThunk?: string | Function) => {
    let resolvedKey: string | undefined;

    if (typeof keyOrThunk === "string") {
      resolvedKey = keyOrThunk;
    } else if (typeof keyOrThunk === "function") {
      resolvedKey =
        (keyOrThunk as any).typePrefix || keyOrThunk.name || thunkKeyMap.get(keyOrThunk);
    }

    if (resolvedKey) {
      controllersRef.current.get(resolvedKey)?.abort();
      controllersRef.current.delete(resolvedKey);
    } else {
      // если ключ не передан — гасим все
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current.clear();
    }
  };

  return abortableDispatch;
};