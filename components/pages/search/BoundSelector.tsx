"use client";

import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedBound } from "@/store/slices/searchSlice";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { logger } from "@/lib/logger";
import type { RouteItem as KmbRouteItem } from "@/lib/companies/kmb/types";
import type { CitybusRouteItem } from "@/lib/companies/citybus/types";

export interface BoundSelectorProps {
  route: string;
}

function getName(
  item: KmbRouteItem | CitybusRouteItem,
  locale: "en" | "zh-HK",
  reverse: boolean = false
): string {
  const orig = locale === "zh-HK" ? item.orig_tc : item.orig_en;
  const dest = locale === "zh-HK" ? item.dest_tc : item.dest_en;
  return reverse ? `${dest} → ${orig}` : `${orig} → ${dest}`;
}

export function BoundSelector({ route }: BoundSelectorProps) {
  const t = useTranslations("search");
  const dispatch = useAppDispatch();
  const locale = useAppSelector((s) => s.lang.locale);
  const selectedCompanyId = useAppSelector(
    (s) => s.company.selectedCompanyId
  );
  const routeList = useAppSelector(
    (s) => s.companyCache[selectedCompanyId]?.routeList ?? []
  );

  const kmbBounds =
    selectedCompanyId === "kmb"
      ? (routeList as KmbRouteItem[]).filter((r) => r.route === route)
      : [];
  const outbound = kmbBounds.find((r) => r.bound === "O");
  const inbound = kmbBounds.find((r) => r.bound === "I");

  const ctbRoute =
    selectedCompanyId === "ctb"
      ? (routeList as CitybusRouteItem[]).find((r) => r.route === route)
      : undefined;

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
        {selectedCompanyId === "kmb" ? (
          <>
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
          </>
        ) : ctbRoute ? (
          <>
            <SelectableCard
              label={t("inbound")}
              description={getName(ctbRoute, locale, true)}
              onClick={() => handleSelect("I")}
            />
            <SelectableCard
              label={t("outbound")}
              description={getName(ctbRoute, locale)}
              onClick={() => handleSelect("O")}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
