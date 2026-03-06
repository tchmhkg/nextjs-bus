import { createSlice } from "@reduxjs/toolkit";
import type { RouteItem, StopItem, RouteStopItem } from "@/lib/companies/kmb/types";

export interface CompanyCacheState {
  kmb: {
    routeList: RouteItem[];
    stopList: StopItem[];
    routeStopList: RouteStopItem[];
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CompanyCacheState = {
  kmb: null,
  isLoading: false,
  error: null,
};

export const companyCacheSlice = createSlice({
  name: "companyCache",
  initialState,
  reducers: {
    setCacheLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCacheSuccess: (
      state,
      action: {
        payload: {
          routeList: RouteItem[];
          stopList: StopItem[];
          routeStopList: RouteStopItem[];
        };
      }
    ) => {
      state.kmb = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCacheError: (state, action: { payload: string }) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setCacheLoading, setCacheSuccess, setCacheError } =
  companyCacheSlice.actions;
