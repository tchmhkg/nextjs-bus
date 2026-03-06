"use client";

import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import { formatTime } from "@/lib/formatTime";
import type { ETAItem } from "@/lib/companies/kmb/types";

export interface ETADisplayProps {
  items: ETAItem[];
  isLoading?: boolean;
}

export function ETADisplay({ items, isLoading }: ETADisplayProps) {
  const timeFormat = useAppSelector((s) => s.settings.timeFormat);
  const locale = useAppSelector((s) => s.lang.locale);
  const localeStr = locale === "zh-HK" ? "zh-HK" : "en-HK";
  const t = useTranslations("stop");

  if (isLoading) {
    return (
      <div className="mt-2 text-sm text-zinc-500">{t("loading")}</div>
    );
  }

  const displayItems = items.slice(0, 3);

  if (displayItems.length === 0) {
    return <div className="mt-2 text-sm text-zinc-500">{t("noEta")}</div>;
  }

  return (
    <ul className="mt-2 space-y-1">
      {displayItems.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-sm">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {formatTime(item.eta, timeFormat, localeStr)}
          </span>
          {item.rmk_tc && (
            <span className="text-xs text-zinc-500">({item.rmk_tc})</span>
          )}
        </li>
      ))}
    </ul>
  );
}
