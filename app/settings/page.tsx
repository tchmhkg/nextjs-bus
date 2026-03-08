"use client";

import { useCallback, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTimeFormat, setNearbyRangeMeters, NEARBY_RANGE_OPTION_STRINGS } from "@/store/slices/settingsSlice";
import { setLocale } from "@/store/slices/langSlice";
import { loadCache } from "@/store/thunks/loadCache";
import { PageLayout } from "@/components/ui/PageLayout";
import { OptionButtonGroup } from "@/components/ui/OptionButtonGroup";
import { Button } from "@/components/ui/Button";
import { LocationPermissionSection } from "@/components/common/LocationPermissionSection";
import type { TimeFormat, NearbyRangeMeters } from "@/store/slices/settingsSlice";
import type { Locale } from "@/store/slices/langSlice";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const timeFormat = useAppSelector((s) => s.settings.timeFormat);
  const nearbyRangeMeters = useAppSelector((s) => s.settings.nearbyRangeMeters);
  const locale = useAppSelector((s) => s.lang.locale);
  const cacheLoading = useAppSelector((s) => s.companyCache.isLoading);
  const [refreshMessage, setRefreshMessage] = useState<"success" | "error" | null>(null);

  const resolvedTheme = (theme ?? "system") as "light" | "dark" | "system";

  const handleRefreshCache = useCallback(async () => {
    setRefreshMessage(null);
    const ok = await loadCache(dispatch);
    setRefreshMessage(ok ? "success" : "error");
    setTimeout(() => setRefreshMessage(null), 3000);
  }, [dispatch]);

  return (
    <PageLayout>
      <div className="space-y-3">
        <OptionButtonGroup
          title={t("theme")}
          options={["light", "dark", "system"] as const}
          value={resolvedTheme}
          onChange={(v) => setTheme(v)}
          getLabel={(opt) => t(`theme_${opt}`)}
        />
        <OptionButtonGroup
          title={t("timeFormat")}
          options={["12hr", "24hr"] as const}
          value={timeFormat}
          onChange={(v) => dispatch(setTimeFormat(v as TimeFormat))}
          getLabel={(opt) => t(`time_${opt}`)}
        />
        <OptionButtonGroup
          title={t("nearbyRange")}
          options={NEARBY_RANGE_OPTION_STRINGS}
          value={String(nearbyRangeMeters) as "50" | "100" | "200" | "300" | "400" | "800"}
          onChange={(v) => dispatch(setNearbyRangeMeters(Number(v) as NearbyRangeMeters))}
          getLabel={(opt) => t("nearbyRange_m", { m: opt })}
        />
        <OptionButtonGroup
          title={t("language")}
          options={["zh-HK", "en"] as const}
          value={locale}
          onChange={(v) => dispatch(setLocale(v as Locale))}
          getLabel={(opt) => (opt === "zh-HK" ? t("lang_tc") : t("lang_en"))}
        />
        <LocationPermissionSection />
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("refreshCache")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefreshCache}
              disabled={cacheLoading}
            >
              {cacheLoading ? t("loading") : t("refreshCacheButton")}
            </Button>
            {refreshMessage === "success" && (
              <span className="text-sm text-green-600 dark:text-green-500">
                {t("refreshCacheSuccess")}
              </span>
            )}
            {refreshMessage === "error" && (
              <span className="text-sm text-red-600 dark:text-red-500">
                {t("refreshCacheError")}
              </span>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
