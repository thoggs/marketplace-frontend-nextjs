import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { themeColorType } from "@/store/types";

const initialState: themeColorType = {
  themeColor: '#1A1B1E',
};

export const themeColorSlice = createSlice({
  name: 'themeColor',
  initialState,
  reducers: {
    setValue: (
      _state,
      action: PayloadAction<themeColorType>) => action.payload,
  },
});

export const {
  setValue: setThemeColor,
} = themeColorSlice.actions;

export default themeColorSlice.reducer;
