import { createSlice } from "@reduxjs/toolkit";

export interface Bookmark {
  id: string;
  company: "kmb";
  stopId: string;
  route: string;
  bound?: "O" | "I";
  serviceType: string;
  stopNameTc: string;
  stopNameEn: string;
  destTc?: string;
  destEn?: string;
  createdAt: number;
}

function createBookmarkId(
  company: string,
  stopId: string,
  route: string,
  serviceType: string
): string {
  return `${company}-${stopId}-${route}-${serviceType}`;
}

export interface BookmarkState {
  items: Bookmark[];
}

const initialState: BookmarkState = {
  items: [],
};

export const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addBookmark: (
      state,
      action: {
        payload: Omit<Bookmark, "id" | "createdAt"> & { bound?: "O" | "I" };
      }
    ) => {
      const id = createBookmarkId(
        action.payload.company,
        action.payload.stopId,
        action.payload.route,
        action.payload.serviceType
      );
      if (state.items.some((b) => b.id === id)) return;
      state.items.push({
        ...action.payload,
        id,
        createdAt: Date.now(),
      });
    },
    removeBookmark: (state, action: { payload: string }) => {
      state.items = state.items.filter((b) => b.id !== action.payload);
    },
    toggleBookmark: (
      state,
      action: {
        payload: Omit<Bookmark, "id" | "createdAt"> & { bound?: "O" | "I" };
      }
    ) => {
      const id = createBookmarkId(
        action.payload.company,
        action.payload.stopId,
        action.payload.route,
        action.payload.serviceType
      );
      const idx = state.items.findIndex((b) => b.id === id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push({
          ...action.payload,
          id,
          createdAt: Date.now(),
        });
      }
    },
  },
});

export const { addBookmark, removeBookmark, toggleBookmark } =
  bookmarkSlice.actions;

export function getBookmarkId(
  company: string,
  stopId: string,
  route: string,
  serviceType: string
): string {
  return createBookmarkId(company, stopId, route, serviceType);
}
