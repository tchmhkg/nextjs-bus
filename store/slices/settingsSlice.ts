import { createSlice } from "@reduxjs/toolkit";

export type TimeFormat = "12hr" | "24hr";

export const NEARBY_RANGE_OPTIONS = [50, 100, 200, 300, 400, 800] as const;
export type NearbyRangeMeters = (typeof NEARBY_RANGE_OPTIONS)[number];

export const NEARBY_RANGE_OPTION_STRINGS = NEARBY_RANGE_OPTIONS.map(n => n.toString());

export interface SettingsState {
  timeFormat: TimeFormat;
  nearbyRangeMeters: NearbyRangeMeters;
}

const initialState: SettingsState = {
  timeFormat: "24hr",
  nearbyRangeMeters: 100,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTimeFormat: (state, action: { payload: TimeFormat }) => {
      state.timeFormat = action.payload;
    },
    setNearbyRangeMeters: (state, action: { payload: NearbyRangeMeters }) => {
      state.nearbyRangeMeters = action.payload;
    },
  },
});

export const { setTimeFormat, setNearbyRangeMeters } = settingsSlice.actions;
