import { Anime, Manga } from '@/typescript';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookmarkState {
  anime: { [key in number]: Anime };
  manga: { [key in number]: Manga };
}

const saved = localStorage.getItem('bookmark');
const bookmark = saved ? (JSON.parse(saved) as BookmarkState) : null;

const initialState: BookmarkState = bookmark || {
  anime: {},
  manga: {},
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    addBookmarkedItem(
      state,
      action: PayloadAction<{ type: keyof BookmarkState; item: Anime | Manga }>,
    ) {
      const { type, item } = action.payload;
      if (!state[type][item.mal_id]) state[type][item.mal_id] = item;
      else {
        delete state[type][item.mal_id];
      }
    },
  },
});

export const { addBookmarkedItem } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
