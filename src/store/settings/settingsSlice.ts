import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  sfw: boolean;
  scrollToTop: boolean;
  bodyLock: boolean;
  openModalCount: number;
}

const initialState: SettingsState = {
  sfw: true,
  scrollToTop: true,
  bodyLock: false,
  openModalCount: 0,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: (state) => {
    return {
      toggleScrollToTop: (state) => {
        state.scrollToTop = !state.scrollToTop;
      },
      setScrollToTop: (state, action: PayloadAction<boolean>) => {
        state.scrollToTop = action.payload;
      },

      toggleSfw: (state) => {
        state.sfw = !state.sfw;
      },
      setSfw: (state, action: PayloadAction<boolean>) => {
        state.sfw = action.payload;
      },

      plusOpenModal: (state) => {
        state.bodyLock = true;
        state.openModalCount++;
      },
      minusOpenModal: (state) => {
        const openModalCount = state.openModalCount - 1;
        state.openModalCount = openModalCount;
        if (openModalCount === 0) state.bodyLock = false;
      },
    };
  },
});

export const {
  toggleSfw,
  setSfw,
  toggleScrollToTop,
  setScrollToTop,
  plusOpenModal,
  minusOpenModal,
} = settingsSlice.actions;

export default settingsSlice.reducer;
