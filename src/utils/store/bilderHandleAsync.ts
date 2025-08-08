import { AsyncThunkConfig } from '@/typescript';
import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, Draft } from '@reduxjs/toolkit';
import { FetchStatus } from '../../typescript/fetchStatus';

// export function createHandleAsync<
//   State extends Record<string, any>,
//   StatusKey extends keyof State & string,
// >(builder: ActionReducerMapBuilder<State>, initialState: State, statusKey: StatusKey) {
//   return function handleAsync<
//     K extends StatusKey,
//     Returned extends State[K],
//     ThunkArg = void,
//     ThunkConfig extends {} = {},
//   >(
//     key: K,
//     thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
//     onFulfilled?: CaseReducer<Draft<State>, ReturnType<typeof thunk.fulfilled>>,
//   ) {
//     builder
//       .addCase(thunk.pending, (state: Draft<State>) => {
//         if (key === 'item') {
//           const newStatus = { item: FetchStatus.LOADING };
//           Object.assign(state, initialState);
//           state[statusKey] = newStatus as State[typeof statusKey];
//         } else {
//           state.status[statusKey] = FetchStatus.LOADING;
//         }
//       })
//       .addCase(thunk.fulfilled, (state: Draft<State>, action) => {
//         if (onFulfilled) {
//           onFulfilled(state, action);
//         } else {
//           if (action.payload) state[key] = action.payload;
//         }
//         state.status[statusKey] = FetchStatus.SUCCESS;
//       })
//       .addCase(thunk.rejected, (state: Draft<State>) => {
//         state.status[statusKey] = FetchStatus.ERROR;
//       });
//   };
// }

// export const createHandle = <
//   State extends {
//     status: Partial<Record<DataKeys, FetchStatus>>;
//   } & Record<string, any>,
//   DataKeys extends Exclude<keyof State, 'status'> = Exclude<keyof State, 'status'>,
// >(
//   builder: ActionReducerMapBuilder<State>,
//   initialState: State,
// ) => {
//   return function handleAsync<
//     K extends DataKeys,
//     Returned extends State[K],
//     ThunkArg = void,
//     ThunkConfig extends {} = {},
//   >(
//     key: K,
//     thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
//     onFulfilled?: CaseReducer<Draft<State>, ReturnType<typeof thunk.fulfilled>>,
//   ) {
//     builder
//       .addCase(thunk.pending, (state) => {
//         if (key === 'item') {
//           const newStatus = {
//             item: FetchStatus.LOADING,
//           };
//           Object.assign(state, initialState);
//           state.status = newStatus as any;
//         } else {
//           (state.status as Record<K, FetchStatus>)[key] = FetchStatus.LOADING;
//         }
//       })
//       .addCase(thunk.fulfilled, (state, action) => {
//         if (onFulfilled) {
//           onFulfilled(state, action);
//         } else if (action.payload !== undefined) {
//           state[key] = action.payload;
//         }
//         (state.status as Record<K, FetchStatus>)[key] = FetchStatus.SUCCESS;
//       })
//       .addCase(thunk.rejected, (state) => {
//         (state.status as Record<K, FetchStatus>)[key] = FetchStatus.ERROR;
//       });
//   };
// };

// export const createHandle = <
//   State extends {
//     status: Partial<Record<DataKeys, FetchStatus>>;
//   } & Record<string, any>,
//   DataKeys extends Exclude<keyof State, 'status'> = Exclude<keyof State, 'status'>,
// >(
//   builder: ActionReducerMapBuilder<State>,
//   initialState: State,
// ) => {
//   return function handleAsync<
//     K extends DataKeys,
//     Returned extends State[K],
//     ThunkArg = void,
//     ThunkConfig extends {} = {},
//   >(
//     key: K,
//     thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
//     onFulfilled?: CaseReducer<Draft<State>, ReturnType<typeof thunk.fulfilled>>,
//   ) {
//     builder
//       .addCase(thunk.pending, (state) => {
//         const status = state.status as Draft<Partial<Record<K, FetchStatus>>>;
//         if (key === 'item') {
//           const newStatus = {
//             item: FetchStatus.LOADING,
//           };
//           Object.assign(state, initialState);
//           state.status = newStatus as State[typeof key];
//         } else {
//           (state as State[typeof key]).status[key] = FetchStatus.LOADING;
//         }
//       })
//       .addCase(thunk.fulfilled, (state, action) => {
//         if (onFulfilled) {
//           onFulfilled(state as State[typeof key], action);
//         } else {
//           if (action.payload) state[key as State[typeof key]]  = action.payload;
//         }
//         (state as State[typeof key]).status[key] = FetchStatus.SUCCESS;
//       })
//       .addCase(thunk.rejected, (state) => {
//         (state as State[typeof key]).status[key] = FetchStatus.ERROR;
//       });
//   };
// };

// // Универсальный тип для состояния
// type StateWithStatus = {
//   status: Partial<Record<string, FetchStatus>>;
// };

// // Извлечение ключей данных (всё кроме `status`)
// type DataKeys<S extends StateWithStatus> = Exclude<keyof S, 'status'>;

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
      .addCase(thunk.rejected, (state) => {
        (state.status as Record<K, FetchStatus>)[key] = FetchStatus.ERROR;
      });
  };
};

// export const createHandle2 = <
//   // Обобщённый тип ключей данных
//   DataKeys extends string,
//   // Обязательное поле status с нужной структурой
//   State extends Record<DataKeys, any> & {
//     status: Partial<Record<DataKeys, FetchStatus>>;
//   },
// >(
//   builder: ActionReducerMapBuilder<State>,
//   initialState: State,
// ) => {
//   return function handleAsync<
//     K extends DataKeys,
//     Returned extends State[K],
//     ThunkArg = undefined,
//     ThunkConfig extends {} = {},
//   >(
//     key: K,
//     thunk: AsyncThunk<Returned, ThunkArg, ThunkConfig>,
//     onFulfilled?: CaseReducer<Draft<State>, ReturnType<typeof thunk.fulfilled>>,
//   ) {
//     builder
//       .addCase(thunk.pending, (state) => {
//         if (key === 'item') {
//           const newStatus: Partial<Record<DataKeys, FetchStatus>> = {
//             item: FetchStatus.LOADING,
//           };
//           Object.assign(state, initialState);
//           state.status = newStatus;
//         } else {
//           state.status[key] = FetchStatus.LOADING;
//         }
//       })
//       .addCase(thunk.fulfilled, (state, action) => {
//         if (onFulfilled) {
//           onFulfilled(state, action);
//         } else if (action.payload !== undefined) {
//           state[key] = action.payload;
//         }
//         state.status[key] = FetchStatus.SUCCESS;
//       })
//       .addCase(thunk.rejected, (state) => {
//         state.status[key] = FetchStatus.ERROR;
//       });
//   };
// };

// type WithStatus<T> = T & {
//   status: Partial<Record<keyof Omit<T, 'status'>, FetchStatus>>;
// };

// export function createHandle4<State extends Record<string, any>>(
//   builder: ActionReducerMapBuilder<WithStatus<State>>,
//   initialState: WithStatus<State>
// ) {
//   type DataKey = keyof Omit<State, 'status'>;

//   return function handleAsync<
//     K extends DataKey,
//     Returned extends WithStatus<State>[K],
//     ThunkArg,
//     Thunk extends AsyncThunk<Returned, ThunkArg, {}>
//   >(
//     key: K,
//     thunk: Thunk,
//     onFulfilled?: (
//       state: Draft<WithStatus<State>>,
//       action: ReturnType<typeof thunk.fulfilled>
//     ) => void
//   ) {
//     builder
//       .addCase(thunk.pending, (state) => {
//         if (key === 'item') {
//           state.status = {
//             ...initialState.status,
//             [key]: FetchStatus.LOADING,
//           };
//           Object.assign(state, initialState);
//         } else {
//           state.status[key] = FetchStatus.LOADING;
//         }
//       })
//       .addCase(thunk.fulfilled, (state, action) => {
//         if (onFulfilled) {
//           onFulfilled(state, action);
//         } else {
//           state[key] = action.payload;
//         }
//         state.status[key] = FetchStatus.SUCCESS;
//       })
//       .addCase(thunk.rejected, (state) => {
//         state.status[key] = FetchStatus.ERROR;
//       });
//   };
// }
