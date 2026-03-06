"use client";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { NextIntlClientProvider } from "next-intl";
import { store, persistor } from "@/store";
import { IntlProviderWrapper } from "./IntlProviderWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IntlProviderWrapper>{children}</IntlProviderWrapper>
      </PersistGate>
    </Provider>
  );
}
