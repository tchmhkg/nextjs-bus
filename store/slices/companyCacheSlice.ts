import { createSlice } from "@reduxjs/toolkit";
import type {
  RouteItem as KmbRouteItem,
  StopItem as KmbStopItem,
  RouteStopItem as KmbRouteStopItem,
} from "@/lib/companies/kmb/types";
import type {
  CitybusRouteItem,
  CitybusStopItem,
  CitybusRouteStopItem,
} from "@/lib/companies/citybus/types";

export interface CompanyCacheEntry<R, S, RS> {
  routeList: R[];
  stopList: S[];
  routeStopList: RS[];
}

export interface CompanyCacheState {
  kmb: CompanyCacheEntry<KmbRouteItem, KmbStopItem, KmbRouteStopItem> | null;
  ctb: CompanyCacheEntry<CitybusRouteItem, CitybusStopItem, CitybusRouteStopItem> | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CompanyCacheState = {
  kmb: null,
  ctb: null,
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
          company: "kmb" | "ctb";
          routeList: unknown[];
          stopList: unknown[];
          routeStopList: unknown[];
        };
      }
    ) => {
      const { company, routeList, stopList, routeStopList } = action.payload;
      if (company === "kmb") {
        state.kmb = {
          routeList: routeList as KmbRouteItem[],
          stopList: stopList as KmbStopItem[],
          routeStopList: routeStopList as KmbRouteStopItem[],
        };
      } else if (company === "ctb") {
        state.ctb = {
          routeList: routeList as CitybusRouteItem[],
          stopList: stopList as CitybusStopItem[],
          routeStopList: routeStopList as CitybusRouteStopItem[],
        };
      }
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
