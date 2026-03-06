"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTimeFormat } from "@/store/slices/settingsSlice";
import { setLocale } from "@/store/slices/langSlice";
import { PageLayout } from "@/components/ui/PageLayout";
import { OptionButtonGroup } from "@/components/ui/OptionButtonGroup";
import type { TimeFormat } from "@/store/slices/settingsSlice";
import type { Locale } from "@/store/slices/langSlice";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const timeFormat = useAppSelector((s) => s.settings.timeFormat);
  const locale = useAppSelector((s) => s.lang.locale);

  const resolvedTheme = (theme ?? "system") as "light" | "dark" | "system";

  return (
    <PageLayout title={t("title")}>
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
          title={t("language")}
          options={["zh-HK", "en"] as const}
          value={locale}
          onChange={(v) => dispatch(setLocale(v as Locale))}
          getLabel={(opt) => (opt === "zh-HK" ? t("lang_tc") : t("lang_en"))}
        />
      </div>
    </PageLayout>
  );
}
