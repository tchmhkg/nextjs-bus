"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCache } from "@/store/thunks/loadCache";

export function CacheLoader({ children }: { children: React.ReactNode }) {
  const t = useTranslations("errors");
  const dispatch = useAppDispatch();
  const cache = useAppSelector((s) => s.companyCache.kmb);
  const isLoading = useAppSelector((s) => s.companyCache.isLoading);
  const error = useAppSelector((s) => s.companyCache.error);

  useEffect(() => {
    if (!cache && !isLoading) {
      loadCache(dispatch);
    }
  }, [cache, isLoading, dispatch]);

  if (error) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-red-600 dark:text-red-400">
          {t("cacheLoadFailed")}
        </p>
        <button
          type="button"
          onClick={() => loadCache(dispatch)}
          className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
