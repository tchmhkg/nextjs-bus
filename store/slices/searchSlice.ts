import { createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  selectedRoute: string | null;
  selectedBound: "O" | "I" | null;
  expandedStopId: string | null;
}

const initialState: SearchState = {
  selectedRoute: null,
  selectedBound: null,
  expandedStopId: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSelectedRoute: (state, action: { payload: string | null }) => {
      state.selectedRoute = action.payload;
      state.selectedBound = null;
      state.expandedStopId = null;
    },
    setSelectedBound: (state, action: { payload: "O" | "I" | null }) => {
      state.selectedBound = action.payload;
      state.expandedStopId = null;
    },
    setExpandedStopId: (state, action: { payload: string | null }) => {
      state.expandedStopId = action.payload;
    },
  },
});

export const { setSelectedRoute, setSelectedBound, setExpandedStopId } =
  searchSlice.actions;
