import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig, ItemIdSelector } from '@/typescript';

type ThunkWithIdCallback<Returned, Arg = undefined> = (
  id: number,
  arg: Arg,
  signal: AbortSignal,
) => Promise<Returned>;

function createThunkWithId(getIdFromState: ItemIdSelector) {
  return function <Returned, Arg = void>(
    typePrefix: string,
    callback: ThunkWithIdCallback<Returned, Arg>,
  ) {
    return createAsyncThunk<Returned, Arg, AsyncThunkConfig>(
      typePrefix,
      async (arg, { getState, signal, rejectWithValue }) => {
        const id = getIdFromState(getState()) ?? null;
        return id ? callback(id, arg, signal) : rejectWithValue(`${typePrefix}: ID is missing`);
      },
    );
  };
}

/* ========== Anime ============ */
export const createAnimeThunkWithId = createThunkWithId(
  (state) => state.animeFullById.item?.mal_id,
);

/* ========== Manga ============ */
export const createMangaThunkWithId = createThunkWithId(
  (state) => state.mangaFullById.item?.mal_id,
);

/* ========== Character ============ */
export const createCharacterThunkWithId = createThunkWithId(
  (state) => state.characterFullById.item?.mal_id,
);

/* ========== Person ============ */
export const createPersonThunkWithId = createThunkWithId(
  (state) => state.personFullById.item?.mal_id,
);
