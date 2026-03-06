import { createSlice } from "@reduxjs/toolkit";

export type Locale = "en" | "zh-HK";

export interface LangState {
  locale: Locale;
}

const initialState: LangState = {
  locale: "zh-HK",
};

export const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLocale: (state, action: { payload: Locale }) => {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = langSlice.actions;
