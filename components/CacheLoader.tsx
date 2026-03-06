"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCache } from "@/store/thunks/loadCache";
import { Button } from "@/components/ui/Button";

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
        <Button onClick={() => loadCache(dispatch)}>{t("retry")}</Button>
      </div>
    );
  }

  return <>{children}</>;
}
