"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setExpandedStopId } from "@/store/slices/searchSlice";
import { toggleBookmark, getBookmarkId } from "@/store/slices/bookmarkSlice";
import { logger } from "@/lib/logger";
import { ETADisplay } from "./ETADisplay";
import type { ETAItem } from "@/lib/companies/kmb/types";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";
import type { CompanyId } from "@/lib/companies/config";

export interface StopRowProps {
  stopId: string;
  stopNameTc: string;
  stopNameEn: string;
  seq: number;
  route: string;
  bound: "O" | "I";
  destTc?: string;
  destEn?: string;
  isExpanded: boolean;
  locale: "en" | "zh-HK";
}

export function StopRow({
  stopId,
  stopNameTc,
  stopNameEn,
  seq,
  route,
  bound,
  destTc,
  destEn,
  isExpanded,
  locale,
}: StopRowProps) {
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((s) => s.bookmarks.items);
  const selectedCompanyId = useAppSelector(
    (s) => s.company.selectedCompanyId
  );
  const [etaItems, setEtaItems] = useState<ETAItem[]>([]);
  const [etaLoading, setEtaLoading] = useState(false);
  const [hasFetchedEta, setHasFetchedEta] = useState(false);

  const bookmarkId = getBookmarkId(
    selectedCompanyId,
    stopId,
    route,
    DEFAULT_SERVICE_TYPE,
    bound
  );
  const isBookmarked = bookmarks.some((b) => b.id === bookmarkId);

  const fetchEta = useCallback(async () => {
    setEtaLoading(true);
    logger.debug("Fetching ETA for stop", { stopId, route });
    try {
      const params =
        selectedCompanyId === "kmb"
          ? `serviceType=${DEFAULT_SERVICE_TYPE}`
          : `direction=${bound === "I" ? "inbound" : "outbound"}`;
      const res = await fetch(
        `/api/companies/${selectedCompanyId}/eta?stopId=${encodeURIComponent(
          stopId
        )}&route=${encodeURIComponent(route)}&${params}`
      );
      const json = await res.json();
      if (res.ok && json.data) {
        setEtaItems(json.data);
      }
    } catch (err) {
      logger.error("ETA fetch failed", {
        error: err instanceof Error ? err.message : String(err),
        stopId,
        route,
      });
    } finally {
      setEtaLoading(false);
      setHasFetchedEta(true);
    }
  }, [stopId, route, selectedCompanyId, bound]);

  useEffect(() => {
    if (isExpanded && !hasFetchedEta && !etaLoading) {
      fetchEta();
    }
  }, [isExpanded, hasFetchedEta, etaLoading, fetchEta]);

  const handleRowClick = () => {
    dispatch(setExpandedStopId(isExpanded ? null : stopId));
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      toggleBookmark({
        company: selectedCompanyId as CompanyId,
        stopId,
        route,
        bound,
        serviceType: DEFAULT_SERVICE_TYPE,
        stopNameTc,
        stopNameEn,
        destTc,
        destEn,
      })
    );
    logger.info("Bookmark added/removed", { route, stopId });
  };

  const stopName = locale === "zh-HK" ? stopNameTc : stopNameEn;

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800">
      <div
        role="button"
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={(e) => e.key === "Enter" && handleRowClick()}
        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <span className="w-8 shrink-0 text-sm font-medium text-zinc-500">
          {seq}
        </span>
        <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-50">
          {stopName}
        </span>
        <button
          type="button"
          onClick={handleBookmarkClick}
          className="shrink-0 rounded p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? (
            <svg
              className="h-5 w-5 text-amber-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="bg-zinc-50 px-4 py-3 pl-12 dark:bg-zinc-900/50">
          <ETADisplay items={etaItems} isLoading={etaLoading} />
        </div>
      )}
    </div>
  );
}
