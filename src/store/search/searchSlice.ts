import { getAnimeSearch, getCharacterSearch, getMangaSearch } from '@/api';
import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
import { AppAsyncThunk, createAppAsyncThunk } from '@/app/appAsyncThunk';

type SearchSlice = {
  [K in keyof SearchMap]: {
    type: K | null;
    items: SearchMap[K][];
  } & {
    pagination: JikanPaginationPlus | null;
    status: FetchStatus | null;
    value: string;
  };
}[keyof SearchMap];

const initialState = {
  type: null,
  items: [],
  pagination: null,
  status: null,
  value: '',
} as SearchSlice;

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
      thunk: AppAsyncThunk<JikanResponse<SearchMap[T][], JikanPaginationPlus>, any>,
    ) {
      builder.addCase(thunk.pending, (state) => {
        if (state.type !== type) state.items = [];
        state.status = FetchStatus.LOADING;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        const s = state as Extract<SearchSlice, { type: T }>;
        const page = action.meta.arg.page ? action.meta.arg.page : 1;
        const isShowMore = page && page > 1;

        s.value = action.meta.arg.q ? action.meta.arg.q : '';
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

export const { setSearchValue, resetSearchState } = searchSlice.actions;
export default searchSlice.reducer;

//========================================================================================================================================================
export const fetchSearchAnime = createAppAsyncThunk<
  JikanResponse<Anime[], JikanPaginationPlus>,
  Partial<AnimeSearchParams>
>('search/fetchSearchAnime', async (qearyParams) => await getAnimeSearch(qearyParams));

export const fetchSearchManga = createAppAsyncThunk<
  JikanResponse<Manga[], JikanPaginationPlus>,
  Partial<MangaSearchParams>
>('search/fetchSearchManga', async (qearyParams) => await getMangaSearch(qearyParams));

export const fetchSearchCharacter = createAppAsyncThunk<
  JikanResponse<Character[], JikanPaginationPlus>,
  Partial<CharactersSearchParams>
>('search/fetchSearchCharacter', async (qearyParams) => await getCharacterSearch(qearyParams));
