"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { formatDistance } from "@/lib/geo";
import { formatEtaWithRelative } from "@/lib/formatTime";
import { CompanyBadge } from "@/components/common/CompanyBadge";
import { Card } from "@/components/ui/Card";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { ETAItem } from "@/lib/companies/kmb/types";
import type { NearbyRouteItem } from "@/lib/companies/kmb/nearby";
import type { Locale } from "@/store/slices/langSlice";

export interface NearbyRowProps {
  row: NearbyRouteItem;
  etaItems: ETAItem[] | null | undefined;
  loadingEta: boolean;
  locale: Locale;
  timeFormat: "12hr" | "24hr";
  scrollRoot: HTMLDivElement | null;
  onVisibleChange: (key: string, visible: boolean) => void;
  etaKeyStr: string;
}

export function NearbyRow({
  row,
  etaItems,
  loadingEta,
  locale,
  timeFormat,
  scrollRoot,
  onVisibleChange,
  etaKeyStr,
}: NearbyRowProps) {
  const t = useTranslations("nearby");
  const ref = useIntersectionObserver(scrollRoot, etaKeyStr, onVisibleChange);

  const stopName = (tc: string, en: string) =>
    locale === "zh-HK" && tc ? tc : en;
  const destLabel = (tc: string, en: string) =>
    locale === "zh-HK" && tc ? tc : en;

  const firstEta = Array.isArray(etaItems) ? etaItems[0] : null;
  const href = `/?route=${encodeURIComponent(
    row.route
  )}&bound=${row.bound}`;

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