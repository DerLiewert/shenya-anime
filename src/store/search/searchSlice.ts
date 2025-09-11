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
} from '@/models';
import { FetchStatus } from '@/typescript';
import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SearchTypeMap = {
  anime: Anime;
  manga: Manga;
  character: Character;
};

type SearchSlice = {
  [K in keyof SearchTypeMap]: {
    type: K | null;
    items: SearchTypeMap[K][];
  } & {
    pagination: JikanPaginationPlus | null;
    status: FetchStatus | null;
    value: string | null;
  };
}[keyof SearchTypeMap];

const initialState = {
  type: null,
  items: [],
  pagination: null,
  status: null,
  value: null,
} as SearchSlice;

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    resetSearchState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    function commonBuilder<T extends keyof SearchTypeMap>(
      type: T,
      thunk: AsyncThunk<JikanResponse<SearchTypeMap[T][], JikanPaginationPlus>, any, {}>,
    ) {
      builder.addCase(thunk.pending, (state) => {
        if (state.type !== type) state.items = [];
        state.status = FetchStatus.LOADING;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        const s = state as Extract<SearchSlice, { type: T }>;
        const page = action.meta.arg.page ? action.meta.arg.page : 1;
        const isShowMore = page && page > 1;

        s.type = type;
        s.items = (
          isShowMore ? [...state.items, ...action.payload.data] : action.payload.data
        ) as typeof s.items;
        s.pagination = action.payload.pagination ? action.payload.pagination : null;
        s.status = FetchStatus.SUCCESS;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        if (action.meta.aborted) {
          if (state.items.length > 0) {
            state.status = FetchStatus.SUCCESS;
          } else {
            state.status = null;
          }
          return;
        }
        state.status = FetchStatus.ERROR;
      });
    }
    commonBuilder('anime', fetchSearchAnime);
    commonBuilder('manga', fetchSearchManga);
    commonBuilder('character', fetchSearchCharacter);
  },
});

export const fetchSearchAnime = createAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  Partial<AnimeSearchParams>
>('search/fetchSearchAnime', async (qearyParams) => {
  return await getAnimeSearch(qearyParams);
});

export const fetchSearchManga = createAsyncThunk<
  JikanResponse<Manga[], JikanPaginationPlus>,
  Partial<MangaSearchParams>
>('search/fetchSearchManga', async (qearyParams) => {
  return await getMangaSearch(qearyParams);
});

export const fetchSearchCharacter = createAsyncThunk<
  JikanResponse<Character[], JikanPaginationPlus>,
  Partial<CharactersSearchParams>
>('search/fetchSearchCharacter', async (qearyParams) => {
  return await getCharacterSearch(qearyParams);
});

export const { setSearchValue, resetSearchState } = searchSlice.actions;
export default searchSlice.reducer;
