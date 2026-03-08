"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { RouteSearchInput } from "@/components/pages/search/RouteSearchInput";
import { BoundSelector } from "@/components/pages/search/BoundSelector";
import { StopList } from "@/components/common/StopList";
import { CacheLoader } from "@/components/infra/CacheLoader";
import { PageLayout } from "@/components/ui/PageLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedRoute, setSelectedBound } from "@/store/slices/searchSlice";
import { CompanyBadge } from "@/components/common/CompanyBadge";

export default function HomePage() {
  const t = useTranslations("search");
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
          <div>
            <h2 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {t("searchByRoute")}
            </h2>
            <RouteSearchInput />
          </div>
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
  const routeList = useAppSelector((s) => s.companyCache.kmb?.routeList ?? []);
  const locale = useAppSelector((s) => s.lang.locale);

  const routeInfo = selectedRoute && selectedBound
    ? routeList.find(
        (r) => r.route === selectedRoute && r.bound === selectedBound
      )
    : null;

  const routeLabel =
    routeInfo && selectedBound
      ? locale === "zh-HK"
        ? `${routeInfo.orig_tc} → ${routeInfo.dest_tc}`
        : `${routeInfo.orig_en} → ${routeInfo.dest_en}`
      : null;

  if (!selectedRoute) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
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
        {selectedBound && (
          <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <span>{selectedRoute}</span>
            <CompanyBadge companyId="kmb" />
            <span>· {selectedBound === "O" ? t("outbound") : t("inbound")}</span>
            {routeLabel ? <span>· {routeLabel}</span> : null}
          </p>
        )}
      </div>
      {!selectedBound ? (
        <BoundSelector route={selectedRoute} />
      ) : (
        <StopList route={selectedRoute} bound={selectedBound} />
      )}
    </div>
  );
}
