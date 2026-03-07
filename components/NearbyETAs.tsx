"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getNearbyRoutes } from "@/lib/companies/kmb/nearby";
import { formatDistance } from "@/lib/geo";
import { formatEtaWithRelative } from "@/lib/formatTime";
import { CompanyBadge } from "@/components/CompanyBadge";
import { Card } from "@/components/ui/Card";
import type { ETAItem } from "@/lib/companies/kmb/types";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";
import type { NearbyRouteItem } from "@/lib/companies/kmb/nearby";
import type { Locale } from "@/store/slices/langSlice";

function useVisible(onVisible: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired.current) return;
        if (entries[0]?.isIntersecting) {
          fired.current = true;
          onVisible();
        }
      },
      { rootMargin: "100px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);
  return ref;
}

function NearbyRow({
  row,
  etaItems,
  loadingEta,
  locale,
  timeFormat,
  stopName,
  destLabel,
  t,
  registerVisible,
}: {
  row: NearbyRouteItem;
  etaItems: ETAItem[] | null | undefined;
  loadingEta: boolean;
  locale: Locale;
  timeFormat: "12hr" | "24hr";
  stopName: (tc: string, en: string) => string;
  destLabel: (tc: string, en: string) => string;
  t: (key: string) => string;
  registerVisible: (key: string) => void;
}) {
  const ref = useVisible(
    useCallback(() => registerVisible(etaKey(row.stopId, row.route)), [row.stopId, row.route, registerVisible])
  );
  const firstEta = Array.isArray(etaItems) ? etaItems[0] : null;
  const href = `/?route=${encodeURIComponent(row.route)}&bound=${row.bound}`;
  return (
    <li>
      <div ref={ref}>
        <Link href={href}>
          <Card className="flex items-center justify-between gap-3 p-3 hover:opacity-95">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-amber-600 dark:text-amber-500">
                  {row.route}
                </span>
                <CompanyBadge companyId="kmb" />
                {(row.destTc || row.destEn) && (
                  <span className="text-zinc-500">
                    → {destLabel(row.destTc, row.destEn)}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-sm text-zinc-600 dark:text-zinc-400">
                {stopName(row.stopNameTc, row.stopNameEn)}
                <span className="ml-1.5 text-zinc-400">
                  · {formatDistance(row.distanceMeters, locale)}
                </span>
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium text-amber-600 dark:text-amber-500">
              {loadingEta && etaItems === undefined
                ? t("loading")
                : formatEtaWithRelative(
                    firstEta?.eta ?? null,
                    timeFormat,
                    locale
                  )}
            </span>
          </Card>
        </Link>
      </div>
    </li>
  );
}

const ETA_CACHE: Record<string, ETAItem[] | null> = {};

function etaKey(stopId: string, route: string): string {
  return `${stopId}|${route}`;
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

export interface NearbyETAsProps {
  limit?: number;
  showViewAll?: boolean;
}

export function NearbyETAs({ limit, showViewAll }: NearbyETAsProps) {
  const t = useTranslations("nearby");
  const { lat, long, error: locationError, loading: locationLoading, refetch } =
    useGeolocation();
  const stopList = useAppSelector((s) => s.companyCache.kmb?.stopList ?? []);
  const routeStopList = useAppSelector((s) => s.companyCache.kmb?.routeStopList ?? []);
  const routeList = useAppSelector((s) => s.companyCache.kmb?.routeList ?? []);
  const locale = useAppSelector((s) => s.lang.locale);
  const timeFormat = useAppSelector((s) => s.settings.timeFormat);
  const nearbyRangeMeters = useAppSelector((s) => s.settings.nearbyRangeMeters);

  const [items, setItems] = useState<NearbyRouteItem[]>([]);
  const [etaMap, setEtaMap] = useState<Record<string, ETAItem[] | null>>({});
  const [loadingEta, setLoadingEta] = useState(false);

  useEffect(() => {
    if (lat == null || long == null || stopList.length === 0) return;
    const result = getNearbyRoutes(
      stopList,
      routeStopList,
      routeList,
      lat,
      long,
      nearbyRangeMeters
    );
    setItems(result);
    setVisibleKeys([]);
  }, [lat, long, stopList, routeStopList, routeList, nearbyRangeMeters]);

  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);

  const registerVisible = useCallback((key: string) => {
    setVisibleKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  const fetchEtas = useCallback(
    async (list: NearbyRouteItem[]) => {
      if (list.length === 0) return;
      setLoadingEta(true);
      const next: Record<string, ETAItem[] | null> = {};
      await Promise.all(
        list.map(async (row) => {
          const key = etaKey(row.stopId, row.route);
          if (ETA_CACHE[key] !== undefined) {
            next[key] = ETA_CACHE[key];
            return;
          }
          try {
            const res = await fetch(
              `/api/companies/kmb/eta?stopId=${encodeURIComponent(row.stopId)}&route=${encodeURIComponent(row.route)}&serviceType=${DEFAULT_SERVICE_TYPE}`
            );
            const json = await res.json();
            const data = res.ok && json.data ? json.data : null;
            ETA_CACHE[key] = data;
            next[key] = data;
          } catch {
            next[key] = null;
          }
        })
      );
      setEtaMap((prev) => ({ ...prev, ...next }));
      setLoadingEta(false);
    },
    []
  );

  useEffect(() => {
    const list = limit != null ? items.slice(0, limit) : items;
    const visibleSet = new Set(visibleKeys);
    const rowsToFetch = list.filter((row) => {
      const key = etaKey(row.stopId, row.route);
      return visibleSet.has(key) && etaMap[key] === undefined;
    });
    if (rowsToFetch.length > 0) fetchEtas(rowsToFetch);
  }, [visibleKeys, items, limit, etaMap, fetchEtas]);

  const handleRefresh = useCallback(() => {
    refetch();
    // Invalidate ETAs for currently visible items so they are re-fetched
    visibleKeys.forEach((key) => {
      delete ETA_CACHE[key];
    });
    setEtaMap((prev) => {
      const next = { ...prev };
      visibleKeys.forEach((k) => delete next[k]);
      return next;
    });
  }, [refetch, visibleKeys]);

  const displayItems = limit != null ? items.slice(0, limit) : items;
  const hasMore = limit != null && items.length > limit;

  const stopName = (tc: string, en: string) =>
    locale === "zh-HK" ? tc : en;
  const destLabel = (destTc: string, destEn: string) =>
    locale === "zh-HK" ? destTc : destEn;

  if (locationLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            aria-label={t("refresh")}
          >
            <RefreshIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-500">{t("gettingLocation")}</p>
      </Card>
    );
  }

  if (locationError || lat == null || long == null) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            aria-label={t("refresh")}
          >
            <RefreshIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          {locationError ? t("locationDenied") : t("locationUnavailable")}
        </p>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            aria-label={t("refresh")}
          >
            <RefreshIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-500">{t("noNearbyStops", { m: nearbyRangeMeters })}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {t("title")}
        </h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loadingEta}
          className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          aria-label={t("refresh")}
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-zinc-500">{t("withinRange", { m: nearbyRangeMeters })}</p>
      <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <ul className="space-y-2 p-2">
          {displayItems.map((row) => (
            <NearbyRow
              key={`${row.stopId}-${row.route}-${row.bound}`}
              row={row}
              etaItems={etaMap[etaKey(row.stopId, row.route)] ?? ETA_CACHE[etaKey(row.stopId, row.route)]}
              loadingEta={loadingEta}
              locale={locale}
              timeFormat={timeFormat}
              stopName={stopName}
              destLabel={destLabel}
              t={t}
              registerVisible={registerVisible}
            />
          ))}
        </ul>
      </div>
      {showViewAll && hasMore && (
        <div className="pt-1">
          <Link
            href="/nearby"
            className="text-sm text-amber-600 hover:underline dark:text-amber-500"
          >
            {t("viewAll")} →
          </Link>
        </div>
      )}
    </div>
  );
}
