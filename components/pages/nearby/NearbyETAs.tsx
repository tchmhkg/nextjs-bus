"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useScrollContainerVisibility, useDebouncedVisibleKeys } from "@/hooks/useScrollVisibility";
import { getNearbyRoutes } from "@/lib/companies/kmb/nearby";
import { NearbyRow } from "./NearbyRow";
import { Card } from "@/components/ui/Card";
import type { ETAItem } from "@/lib/companies/kmb/types";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";
import type { NearbyRouteItem } from "@/lib/companies/kmb/nearby";

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
  const { lat, long, error: locationError, loading: locationLoading, permissionDenied, refetch } =
    useGeolocation();
  const stopList = useAppSelector((s) => s.companyCache.kmb?.stopList ?? []);
  const routeStopList = useAppSelector(
    (s) => s.companyCache.kmb?.routeStopList ?? []
  );
  const routeList = useAppSelector((s) => s.companyCache.kmb?.routeList ?? []);
  const locale = useAppSelector((s) => s.lang.locale);
  const timeFormat = useAppSelector((s) => s.settings.timeFormat);
  const nearbyRangeMeters = useAppSelector(
    (s) => s.settings.nearbyRangeMeters
  );

  const [items, setItems] = useState<NearbyRouteItem[]>([]);
  const [etaMap, setEtaMap] = useState<Record<string, ETAItem[] | null>>({});
  const [loadingEta, setLoadingEta] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollContainerReady, setScrollContainerReady] = useState(false);
  const visibleKeysRef = useRef<Set<string>>(new Set());
  const fetchingKeysRef = useRef<Set<string>>(new Set());

  const debouncedFlushVisible = useDebouncedVisibleKeys(
    visibleKeysRef,
    setVisibleKeys
  );
  useScrollContainerVisibility(scrollContainerRef, debouncedFlushVisible);

  const onVisibleChange = useCallback(
    (key: string, visible: boolean) => {
      if (!visibleKeysRef.current) return;
      if (visible) {
        visibleKeysRef.current.add(key);
      } else {
        visibleKeysRef.current.delete(key);
      }
      debouncedFlushVisible();
    },
    [debouncedFlushVisible]
  );

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
    visibleKeysRef.current.clear();
    setVisibleKeys([]);
  }, [lat, long, stopList, routeStopList, routeList, nearbyRangeMeters]);

  const fetchEtas = useCallback(
    async (list: NearbyRouteItem[]) => {
      if (list.length === 0) return;
      const keysToFetch: string[] = [];
      const next: Record<string, ETAItem[] | null> = {};

      for (const row of list) {
        const key = etaKey(row.stopId, row.route);
        if (ETA_CACHE[key] !== undefined) {
          next[key] = ETA_CACHE[key];
          continue;
        }
        if (fetchingKeysRef.current.has(key)) continue;
        keysToFetch.push(key);
        fetchingKeysRef.current.add(key);
      }

      if (keysToFetch.length > 0) setLoadingEta(true);

      await Promise.all(
        list.map(async (row) => {
          const key = etaKey(row.stopId, row.route);
          if (next[key] !== undefined) return;
          if (!keysToFetch.includes(key)) return;
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
            ETA_CACHE[key] = null;
          } finally {
            fetchingKeysRef.current.delete(key);
          }
        })
      );

      if (Object.keys(next).length > 0) {
        setEtaMap((prev) => ({ ...prev, ...next }));
      }
      setLoadingEta(false);
    },
    []
  );

  useEffect(() => {
    const list = limit != null ? items.slice(0, limit) : items;
    const visibleSet = new Set(visibleKeys);
    const fetchingSet = fetchingKeysRef.current;
    const rowsToFetch = list.filter((row) => {
      const key = etaKey(row.stopId, row.route);
      return (
        visibleSet.has(key) &&
        etaMap[key] === undefined &&
        !fetchingSet.has(key)
      );
    });
    if (rowsToFetch.length > 0) fetchEtas(rowsToFetch);
  }, [visibleKeys, items, limit, etaMap, fetchEtas]);

  const handleRefresh = useCallback(() => {
    refetch();
    visibleKeys.forEach((key) => {
      delete ETA_CACHE[key];
      fetchingKeysRef.current.delete(key);
    });
    setEtaMap((prev) => {
      const next = { ...prev };
      visibleKeys.forEach((k) => delete next[k]);
      return next;
    });
  }, [refetch, visibleKeys]);

  const displayItems = limit != null ? items.slice(0, limit) : items;
  const hasMore = limit != null && items.length > limit;


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
        <div className="mt-2 space-y-2">
          <p className="text-sm text-zinc-500">
            {permissionDenied ? t("locationPermissionDenied") : t("locationUnavailable")}
          </p>
          {permissionDenied && (
            <p className="text-xs text-zinc-400">
              {t("locationPermissionInstructions")}
            </p>
          )}
        </div>
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
        <p className="mt-2 text-sm text-zinc-500">
          {t("noNearbyStops", { m: nearbyRangeMeters })}
        </p>
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
      <p className="text-xs text-zinc-500">
        {t("withinRange", { m: nearbyRangeMeters })}
      </p>
      <div
        ref={(el) => {
          scrollContainerRef.current = el;
          if (el && !scrollContainerReady) setScrollContainerReady(true);
        }}
        className="max-h-[70vh] overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700"
      >
        <ul className="space-y-2 p-2">
          {displayItems.map((row) => (
            <NearbyRow
              key={`${row.stopId}-${row.route}-${row.bound}`}
              row={row}
              etaItems={etaMap[etaKey(row.stopId, row.route)]}
              loadingEta={loadingEta}
              locale={locale}
              timeFormat={timeFormat}
              scrollRoot={scrollContainerReady ? scrollContainerRef.current : null}
              onVisibleChange={onVisibleChange}
              etaKeyStr={etaKey(row.stopId, row.route)}
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
