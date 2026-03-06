"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { RouteSearchInput } from "@/components/RouteSearchInput";
import { BoundSelector } from "@/components/BoundSelector";
import { StopList } from "@/components/StopList";
import { CacheLoader } from "@/components/CacheLoader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedRoute, setSelectedBound } from "@/store/slices/searchSlice";

export default function HomePage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const route = searchParams.get("route");
    const bound = searchParams.get("bound");
    if (route) {
      dispatch(setSelectedRoute(route));
      if (bound === "O" || bound === "I") {
        dispatch(setSelectedBound(bound));
      }
    }
  }, [searchParams, dispatch]);

  return (
    <CacheLoader>
      <main className="mx-auto max-w-md px-4 py-6">
        <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          KMB Bus ETA
        </h1>
        <div className="space-y-6">
          <RouteSearchInput />
          <SearchContent />
        </div>
      </main>
    </CacheLoader>
  );
}

function SearchContent() {
  const t = useTranslations("search");
  const dispatch = useAppDispatch();
  const selectedRoute = useAppSelector((s) => s.search.selectedRoute);
  const selectedBound = useAppSelector((s) => s.search.selectedBound);

  if (!selectedRoute) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            selectedBound
              ? dispatch(setSelectedBound(null))
              : dispatch(setSelectedRoute(null))
          }
          className="text-sm text-amber-600 hover:underline dark:text-amber-500"
        >
          ← {selectedBound ? t("backToBounds") : t("backToSearch")}
        </button>
      </div>
      {!selectedBound ? (
        <BoundSelector route={selectedRoute} />
      ) : (
        <StopList route={selectedRoute} bound={selectedBound} />
      )}
    </div>
  );
}
