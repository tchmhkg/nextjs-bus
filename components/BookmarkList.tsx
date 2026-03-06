"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeBookmark } from "@/store/slices/bookmarkSlice";
import type { ETAItem } from "@/lib/companies/kmb/types";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";

function formatEtaWithExactTime(
  eta: string | null,
  locale: "en" | "zh-HK"
): string {
  if (!eta) return "—";
  try {
    const d = new Date(eta);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const exactTime = d.toLocaleTimeString(locale === "zh-HK" ? "zh-HK" : "en-HK", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (diffMins <= 0) {
      return locale === "zh-HK"
        ? `${exactTime} (即將到站)`
        : `${exactTime} (Arriving)`;
    }
    if (diffMins < 60) {
      return locale === "zh-HK"
        ? `${exactTime} (${diffMins} 分鐘)`
        : `${exactTime} (${diffMins} min)`;
    }
    return exactTime;
  } catch {
    return "—";
  }
}

export function BookmarkList() {
  const t = useTranslations("bookmarks");
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((s) => s.bookmarks.items);
  const locale = useAppSelector((s) => s.lang.locale);
  const [etaMap, setEtaMap] = useState<Record<string, ETAItem[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const fetchEta = useCallback(async (id: string, stopId: string, route: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(
        `/api/companies/kmb/eta?stopId=${encodeURIComponent(stopId)}&route=${encodeURIComponent(route)}&serviceType=${DEFAULT_SERVICE_TYPE}`
      );
      const json = await res.json();
      if (res.ok && json.data) {
        setEtaMap((prev) => ({ ...prev, [id]: json.data }));
      }
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  }, []);

  const handleRefresh = useCallback(() => {
    bookmarks.forEach((b) => fetchEta(b.id, b.stopId, b.route));
  }, [bookmarks, fetchEta]);

  useEffect(() => {
    bookmarks.forEach((b) => fetchEta(b.id, b.stopId, b.route));
  }, [bookmarks, fetchEta]);

  if (bookmarks.length === 0) {
    return (
      <p className="py-8 text-center text-zinc-500">{t("empty")}</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRefresh}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          {t("refresh")}
        </button>
      </div>
      <div className="space-y-3">
        {bookmarks.map((b) => {
          const items = etaMap[b.id] ?? [];
          const firstEta = items[0];
          const isLoading = loadingMap[b.id];
          const stopName = locale === "zh-HK" ? b.stopNameTc : b.stopNameEn;
          const dest = locale === "zh-HK" ? b.destTc : b.destEn;

          const bound = b.bound ?? "O";
          const searchHref = `/?route=${encodeURIComponent(b.route)}&bound=${bound}`;

          return (
            <div
              key={b.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <Link
                href={searchHref}
                className="min-w-0 flex-1 hover:opacity-90"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600 dark:text-amber-500">
                    {b.route}
                  </span>
                  {dest && (
                    <span className="text-sm text-zinc-500">→ {dest}</span>
                  )}
                </div>
                <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                  {stopName}
                </p>
                <p className="mt-1 text-sm">
                  {isLoading ? (
                    <span className="text-zinc-500">{t("loading")}</span>
                  ) : (
                    <span className="font-medium text-amber-600 dark:text-amber-500">
                      {formatEtaWithExactTime(
                        firstEta?.eta ?? null,
                        locale
                      )}
                    </span>
                  )}
                </p>
              </Link>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Link
                  href={searchHref}
                  className="text-sm text-amber-600 hover:underline dark:text-amber-500"
                >
                  {t("viewStops")}
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch(removeBookmark(b.id))}
                  className="rounded px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-700 dark:hover:text-red-400"
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
