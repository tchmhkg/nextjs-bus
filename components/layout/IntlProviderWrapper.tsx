"use client";

import { NextIntlClientProvider } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import en from "@/messages/en.json";
import zhHK from "@/messages/zh-HK.json";

const messages: Record<string, typeof en> = {
  en,
  "zh-HK": zhHK,
};

export function IntlProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useAppSelector((s) => s.lang.locale);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale] ?? messages["zh-HK"]}
    >
      {children}
    </NextIntlClientProvider>
  );
}
