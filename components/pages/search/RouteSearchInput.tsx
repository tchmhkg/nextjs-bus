"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedRoute } from "@/store/slices/searchSlice";
import { logger } from "@/lib/logger";
import { CompanyBadge } from "@/components/common/CompanyBadge";
import type { RouteItem as KmbRouteItem } from "@/lib/companies/kmb/types";
import type { CitybusRouteItem } from "@/lib/companies/citybus/types";
import { setSelectedCompanyId } from "@/store/slices/companySlice";
import type { CompanyId } from "@/lib/companies/config";

const MAX_SUGGESTIONS = 20;
const DEBOUNCE_MS = 200;

interface RouteSuggestion {
  route: string;
  company: CompanyId;
}

function buildRouteSuggestions(
  kmbRoutes: KmbRouteItem[],
  ctbRoutes: CitybusRouteItem[]
): RouteSuggestion[] {
  const suggestions: RouteSuggestion[] = [];
  const seen = new Set<string>();

  for (const r of kmbRoutes) {
    const key = `kmb|${r.route}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({ route: r.route, company: "kmb" });
  }

  for (const r of ctbRoutes) {
    const key = `ctb|${r.route}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({ route: r.route, company: "ctb" });
  }

  suggestions.sort((a, b) =>
    a.route.localeCompare(b.route, undefined, { numeric: true })
  );
  return suggestions;
}

export interface RouteSearchInputProps {
  onFocus?: () => void;
}

export function RouteSearchInput({ onFocus }: RouteSearchInputProps) {
  const t = useTranslations("search");
  const dispatch = useAppDispatch();
  const selectedCompanyId = useAppSelector(
    (s) => s.company.selectedCompanyId
  );
  const kmbRouteList = useAppSelector(
    (s) => s.companyCache.kmb?.routeList ?? []
  );
  const ctbRouteList = useAppSelector(
    (s) => s.companyCache.ctb?.routeList ?? []
  );
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const allSuggestions = useMemo(
    () => buildRouteSuggestions(kmbRouteList, ctbRouteList),
    [kmbRouteList, ctbRouteList]
  );

  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.trim().toUpperCase();
    return allSuggestions
      .filter((s) => s.route.toUpperCase().startsWith(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [allSuggestions, debouncedQuery]);

  const handleSelect = useCallback(
    (s: RouteSuggestion) => {
      dispatch(setSelectedRoute(s.route));
      dispatch(setSelectedCompanyId(s.company));
      setQuery("");
      setIsOpen(false);
      logger.debug("Route selected", { route: s.route, company: s.company });
    },
    [dispatch]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
          onFocus?.();
        }}
        placeholder={t("placeholder")}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-lg placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:placeholder-zinc-500"
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-zinc-500">{t("noResults")}</li>
          ) : (
            suggestions.map((s) => (
              <li key={`${s.company}-${s.route}`}>
                <button
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-amber-600 dark:text-amber-500">
                      {s.route}
                    </span>
                    <CompanyBadge companyId={s.company} />
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
