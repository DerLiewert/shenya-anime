import { useCallback, useEffect, useRef } from 'react';
import { AsyncThunk, AsyncThunkAction } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/app/hooks';
import { AsyncThunkConfig } from '@/typescript';

export type AbortableDispatchFn = <Returned, Arg, ThunkApiConfig extends {} = AsyncThunkConfig>(
  thunk: AsyncThunk<Returned, Arg, ThunkApiConfig>,
  arg?: Parameters<AsyncThunk<Returned, Arg, ThunkApiConfig>>[0],
  key?: string,
) => AsyncThunkAction<Returned, Arg, ThunkApiConfig>;

export type AbortableDispatch = AbortableDispatchFn & {
  abort: (keyOrThunk?: string | Function) => void;
};

//========================================================================================================================================================
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
      let resolvedKey = key ?? (thunk.typePrefix || thunk.name);

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

  // Добавляем метод abort вручную
  (abortableDispatch as any).abort = (keyOrThunk?: string | Function) => {
    let resolvedKey: string | undefined;

    if (typeof keyOrThunk === 'string') {
      resolvedKey = keyOrThunk;
    } else if (typeof keyOrThunk === 'function') {
      resolvedKey =
        (keyOrThunk as any).typePrefix || keyOrThunk.name || thunkKeyMap.get(keyOrThunk);
    }

    if (resolvedKey) {
      controllersRef.current.get(resolvedKey)?.abort();
      controllersRef.current.delete(resolvedKey);
    } else {
      // если ключ не передан, то отменяем все
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current.clear();
    }
  };

  return abortableDispatch;
};
