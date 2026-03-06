"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { RouteSearchInput } from "@/components/RouteSearchInput";
import { BoundSelector } from "@/components/BoundSelector";
import { StopList } from "@/components/StopList";
import { CacheLoader } from "@/components/CacheLoader";
import { PageLayout } from "@/components/ui/PageLayout";
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
      <PageLayout title="Next Bus">
        <div className="space-y-6">
          <RouteSearchInput />
          <SearchContent />
        </div>
      </PageLayout>
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
