"use client";

import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedBound } from "@/store/slices/searchSlice";
import { logger } from "@/lib/logger";
import type { RouteItem } from "@/lib/companies/kmb/types";

export interface BoundSelectorProps {
  route: string;
}

export function BoundSelector({ route }: BoundSelectorProps) {
  const t = useTranslations("search");
  const dispatch = useAppDispatch();
  const locale = useAppSelector((s) => s.lang.locale);
  const routeList = useAppSelector((s) => s.companyCache.kmb?.routeList ?? []);

  const bounds = routeList.filter(
    (r) => r.route === route && r.service_type === "1"
  );

  const outbound = bounds.find((r) => r.bound === "O");
  const inbound = bounds.find((r) => r.bound === "I");

  const handleSelect = (bound: "O" | "I") => {
    dispatch(setSelectedBound(bound));
    logger.debug("Bound selected", { route, bound });
  };

  const getName = (item: RouteItem) => {
    const orig = locale === "zh-HK" ? item.orig_tc : item.orig_en;
    const dest = locale === "zh-HK" ? item.dest_tc : item.dest_en;
    return `${orig} → ${dest}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {route} - {t("outbound")} / {t("inbound")}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {outbound && (
          <button
            type="button"
            onClick={() => handleSelect("O")}
            className="rounded-lg border-2 border-zinc-200 bg-white p-4 text-left transition hover:border-amber-500 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-amber-500 dark:hover:bg-amber-900/20"
          >
            <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
              {t("outbound")}
            </span>
            <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
              {getName(outbound)}
            </p>
          </button>
        )}
        {inbound && (
          <button
            type="button"
            onClick={() => handleSelect("I")}
            className="rounded-lg border-2 border-zinc-200 bg-white p-4 text-left transition hover:border-amber-500 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-amber-500 dark:hover:bg-amber-900/20"
          >
            <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
              {t("inbound")}
            </span>
            <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
              {getName(inbound)}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
