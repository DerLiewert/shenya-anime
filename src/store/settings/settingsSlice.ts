import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  sfw: boolean;
}

const initialState: SettingsState = {
  sfw: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSfw: (state) => {
      state.sfw = !state.sfw;
    },
    setSfw: (state, action: PayloadAction<boolean>) => {
      state.sfw = action.payload;
    },
  },
});

export const { toggleSfw, setSfw } = settingsSlice.actions;

export default settingsSlice.reducer;