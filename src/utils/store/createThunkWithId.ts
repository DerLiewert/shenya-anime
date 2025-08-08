import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig, IdSelector } from '@/typescript';

type ThunkWithIdCallback<Returned, Arg = undefined> = (
  id: number,
  arg: Arg,
  signal: AbortSignal,
) => Promise<Returned>;

export function createThunkWithId<Returned, Arg = undefined>(
  typePrefix: string,
  getIdFromState: IdSelector,
  callback: ThunkWithIdCallback<Returned, Arg>,
): AsyncThunk<Returned, Arg, AsyncThunkConfig> {
  return createAsyncThunk<Returned, Arg, AsyncThunkConfig>(
    typePrefix,
    async (arg, { getState, signal, rejectWithValue }) => {
      const id = getIdFromState(getState());
      if (!id) return rejectWithValue(`${typePrefix}: ID is missing`);
      return callback(id, arg, signal);
    },
  );
}

/* ========== Anime ============ */
export function createAnimeThunkWithId<Returned, Arg = undefined>(
  typePrefix: string,
  callback: ThunkWithIdCallback<Returned, Arg>,
): AsyncThunk<Returned, Arg, AsyncThunkConfig> {
  return createThunkWithId<Returned, Arg>(
    typePrefix,
    (state) => state.animeFullById.item?.mal_id,
    callback,
  );
}

/* ========== Manga ============ */
export function createMangaThunkWithId<Returned, Arg = undefined>(
  typePrefix: string,
  callback: ThunkWithIdCallback<Returned, Arg>,
): AsyncThunk<Returned, Arg, AsyncThunkConfig> {
  return createThunkWithId<Returned, Arg>(
    typePrefix,
    (state) => state.mangaFullById.item?.mal_id,
    callback,
  );
}

/* ========== Character ============ */
export function createCharacterThunkWithId<Returned, Arg = undefined>(
  typePrefix: string,
  callback: ThunkWithIdCallback<Returned, Arg>,
): AsyncThunk<Returned, Arg, AsyncThunkConfig> {
  return createThunkWithId<Returned, Arg>(
    typePrefix,
    (state) => state.characterFullById.item?.mal_id,
    callback,
  );
}

/* ========== Person ============ */
export function createPersonThunkWithId<Returned, Arg = undefined>(
  typePrefix: string,
  callback: ThunkWithIdCallback<Returned, Arg>,
): AsyncThunk<Returned, Arg, AsyncThunkConfig> {
  return createThunkWithId<Returned, Arg>(
    typePrefix,
    (state) => state.personFullById.item?.mal_id,
    callback,
  );
}
