"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTimeFormat } from "@/store/slices/settingsSlice";
import { setLocale } from "@/store/slices/langSlice";
import type { TimeFormat } from "@/store/slices/settingsSlice";
import type { Locale } from "@/store/slices/langSlice";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const timeFormat = useAppSelector((s) => s.settings.timeFormat);
  const locale = useAppSelector((s) => s.lang.locale);

  const resolvedTheme = theme ?? "system";

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {t("title")}
      </h1>
      <div className="space-y-3">
        <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-3 font-medium text-zinc-900 dark:text-zinc-50">
            {t("theme")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(["light", "dark", "system"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTheme(opt)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  resolvedTheme === opt
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                }`}
              >
                {t(`theme_${opt}`)}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-3 font-medium text-zinc-900 dark:text-zinc-50">
            {t("timeFormat")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(["12hr", "24hr"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => dispatch(setTimeFormat(opt))}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  timeFormat === opt
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                }`}
              >
                {t(`time_${opt}`)}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-3 font-medium text-zinc-900 dark:text-zinc-50">
            {t("language")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(["zh-HK", "en"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => dispatch(setLocale(opt as Locale))}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  locale === opt
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                }`}
              >
                {opt === "zh-HK" ? t("lang_tc") : t("lang_en")}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
