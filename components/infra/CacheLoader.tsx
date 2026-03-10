"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCache } from "@/store/thunks/loadCache";
import { Button } from "@/components/ui/Button";

export function CacheLoader({ children }: { children: React.ReactNode }) {
  const t = useTranslations("errors");
  const dispatch = useAppDispatch();
  const kmbCache = useAppSelector((s) => s.companyCache.kmb);
  const ctbCache = useAppSelector((s) => s.companyCache.ctb);
  const isLoading = useAppSelector((s) => s.companyCache.isLoading);
  const error = useAppSelector((s) => s.companyCache.error);

  useEffect(() => {
    if (!kmbCache) {
      loadCache(dispatch, "kmb");
    }
    if (!ctbCache) {
      loadCache(dispatch, "ctb");
    }
  }, [kmbCache, ctbCache, dispatch]);

  if (error) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-red-600 dark:text-red-400">
          {t("cacheLoadFailed")}
        </p>
        <Button
          onClick={() => {
            loadCache(dispatch, "kmb");
            loadCache(dispatch, "ctb");
          }}
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  // Optionally could gate on isLoading + caches, but current UX keeps children rendered.
  return <>{children}</>;
}
