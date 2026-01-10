import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { AppAsyncThunk } from '@/app/appAsyncThunk';

export type AbortableDispatchFn = <Returned, Arg>(
  thunk: AppAsyncThunk<Returned, Arg>,
  arg?: Parameters<AppAsyncThunk<Returned, Arg>>[0],
  key?: string,
) => Promise<Returned>;
// ) => AsyncThunkAction<Returned, Arg, AsyncThunkConfig>;

export type AbortableDispatch = AbortableDispatchFn & {
  abort: (keyOrThunk?: string | Function) => void;
};

//========================================================================================================================================================
let uniqueId = 0;
const thunkKeyMap = new WeakMap<Function, string>();

type Handler = {
  <Returned, Arg>(
    thunk: AppAsyncThunk<NonNullable<Returned>, Arg>,
    arg: Parameters<AppAsyncThunk<Returned, Arg>>[0],
    key?: string,
  ): Promise<Returned>;

  <Returned>(
    thunk: AppAsyncThunk<NonNullable<Returned>>,
    arg?: undefined,
    key?: string,
  ): Promise<Returned>;
};

export const useAbortableDispatch = () => {
  const dispatch = useAppDispatch();
  const controllersRef = useRef<Map<string, AbortController>>(new Map());

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current.clear();
    };
  }, []);

  const abortableDispatch = useCallback<Handler>(
    <Returned, Arg>(
      thunk: AppAsyncThunk<NonNullable<Returned>, Arg>,
      arg: Parameters<typeof thunk>[0], // Parameters<AppAsyncThunk<Returned, Arg>>[0],
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
      const promise = dispatch(action);

      promise.finally(() => {
        if (controllersRef.current.get(resolvedKey) === controller) {
          controllersRef.current.delete(resolvedKey);
        }
      });

      return promise;
    },
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

  return abortableDispatch as Handler & {
    abort: (keyOrThunk?: string | Function) => void;
  };
};

// export const useAbortableDispatch = () => {
//   const dispatch = useAppDispatch();
//   const inFlight = React.useRef<Map<string, any>>(new Map());

//   return React.useCallback(
//     (thunk: any, arg?: any, key?: string) => {
//       const resolvedKey = key ?? thunk.typePrefix;

//       inFlight.current.get(resolvedKey)?.abort();

//       const promise = dispatch(thunk(arg));
//       inFlight.current.set(resolvedKey, promise);

//       promise.finally(() => {
//         if (inFlight.current.get(resolvedKey) === promise) {
//           inFlight.current.delete(resolvedKey);
//         }
//       });

//       return promise;
//     },
//     [dispatch],
//   );
// };
