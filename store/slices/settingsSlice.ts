import { createSlice } from "@reduxjs/toolkit";

export type TimeFormat = "12hr" | "24hr";

export interface SettingsState {
  timeFormat: TimeFormat;
}

const initialState: SettingsState = {
  timeFormat: "24hr",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTimeFormat: (state, action: { payload: TimeFormat }) => {
      state.timeFormat = action.payload;
    },
  },
});

export const { setTimeFormat } = settingsSlice.actions;
