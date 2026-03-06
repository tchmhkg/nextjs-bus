"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { IntlProviderWrapper } from "./IntlProviderWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IntlProviderWrapper>{children}</IntlProviderWrapper>
        </NextThemesProvider>
      </PersistGate>
    </Provider>
  );
}
