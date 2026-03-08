"use client";

import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedBound } from "@/store/slices/searchSlice";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { logger } from "@/lib/logger";
import type { RouteItem } from "@/lib/companies/kmb/types";

export interface BoundSelectorProps {
  route: string;
}

function getName(item: RouteItem, locale: "en" | "zh-HK"): string {
  const orig = locale === "zh-HK" ? item.orig_tc : item.orig_en;
  const dest = locale === "zh-HK" ? item.dest_tc : item.dest_en;
  return `${orig} → ${dest}`;
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

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {route} - {t("outbound")} / {t("inbound")}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {outbound && (
          <SelectableCard
            label={t("outbound")}
            description={getName(outbound, locale)}
            onClick={() => handleSelect("O")}
          />
        )}
        {inbound && (
          <SelectableCard
            label={t("inbound")}
            description={getName(inbound, locale)}
            onClick={() => handleSelect("I")}
          />
        )}
      </div>
    </div>
  );
}
