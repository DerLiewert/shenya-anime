import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppAsyncThunk, createAppAsyncThunk } from '@/app/appAsyncThunk';
import { getAnimeSearch, getCharacterSearch, getMangaSearch } from '@/api';
import {
  Anime,
  AnimeSearchParams,
  Character,
  CharactersSearchParams,
  JikanPaginationPlus,
  JikanResponse,
  Manga,
  MangaSearchParams,
  FetchStatus,
  SearchMap,
} from '@/typescript';
import { FetchListArgs, handleAsyncPending, handleAsyncRejected } from '../_common';

type SearchSlice = {
  [K in keyof SearchMap]: {
    type: K | null;
    items: SearchMap[K][];
  } & {
    pagination: JikanPaginationPlus | null;
    status: FetchStatus | null;
    prevStatus: FetchStatus | null;
    value: string;
  };
}[keyof SearchMap];

const initialState: SearchSlice = {
  items: [],
  pagination: null,
  type: null,
  value: '',
  status: null,
  prevStatus: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    resetSearchState: () => initialState,
  },
  extraReducers: (builder) => {
    function commonBuilder<T extends keyof SearchMap>(
      type: T,
      thunk: AppAsyncThunk<
        JikanResponse<SearchMap[T][], JikanPaginationPlus>,
        FetchListArgs<{ q?: string }>
      >,
    ) {
      builder.addCase(thunk.pending, (state) => {
        if (state.type !== type) state.items = [];
        handleAsyncPending(state);
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        const { params, append } = action.meta.arg;

        state.prevStatus = state.status;

        state.value = params.q ? params.q : '';
        state.type = type;
        state.items = (append ? [...state.items, ...data] : data) as typeof state.items;
        state.pagination = pagination ? pagination : null;

        state.status = FetchStatus.SUCCESS;
      });
      builder.addCase(thunk.rejected, handleAsyncRejected);
    }
    commonBuilder('anime', fetchSearchAnime);
    commonBuilder('manga', fetchSearchManga);
    commonBuilder('character', fetchSearchCharacter);
  },
});

export const { setSearchValue, resetSearchState } = searchSlice.actions;
export default searchSlice.reducer;

//========================================================================================================================================================
export const fetchSearchAnime = createAppAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  FetchListArgs<AnimeSearchParams>
>('search/fetchSearchAnime', async ({ params }) => await getAnimeSearch(params));

export const fetchSearchManga = createAppAsyncThunk<
  JikanResponse<Manga[], JikanPaginationPlus>,
  FetchListArgs<MangaSearchParams>
>('search/fetchSearchManga', async ({ params }) => await getMangaSearch(params));

export const fetchSearchCharacter = createAppAsyncThunk<
  JikanResponse<Character[], JikanPaginationPlus>,
  FetchListArgs<CharactersSearchParams>
>('search/fetchSearchCharacter', async ({ params }) => await getCharacterSearch(params));
