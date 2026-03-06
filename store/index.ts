import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { companyCacheSlice } from "./slices/companyCacheSlice";
import { searchSlice } from "./slices/searchSlice";
import { langSlice } from "./slices/langSlice";
import { bookmarkSlice } from "./slices/bookmarkSlice";
import { settingsSlice } from "./slices/settingsSlice";

const rootReducer = combineReducers({
  companyCache: companyCacheSlice.reducer,
  search: searchSlice.reducer,
  lang: langSlice.reducer,
  bookmarks: bookmarkSlice.reducer,
  settings: settingsSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["bookmarks", "lang", "settings"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
