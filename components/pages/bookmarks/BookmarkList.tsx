"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeBookmark } from "@/store/slices/bookmarkSlice";
import { formatEtaWithRelative } from "@/lib/formatTime";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompanyBadge } from "@/components/common/CompanyBadge";
import type { ETAItem } from "@/lib/companies/kmb/types";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";

export function BookmarkList() {
  const t = useTranslations("bookmarks");
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((s) => s.bookmarks.items);
  const locale = useAppSelector((s) => s.lang.locale);
  const timeFormat = useAppSelector((s) => s.settings.timeFormat);
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
        <Button onClick={handleRefresh}>{t("refresh")}</Button>
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
            <Card
              key={b.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <Link
                href={searchHref}
                className="min-w-0 flex-1 hover:opacity-90"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600 dark:text-amber-500">
                    {b.route}
                  </span>
                  <CompanyBadge companyId={b.company} />
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
                      {formatEtaWithRelative(
                        firstEta?.eta ?? null,
                        timeFormat,
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
                <Button variant="ghost" className="px-3 py-1.5" onClick={() => dispatch(removeBookmark(b.id))}>
                  {t("remove")}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
