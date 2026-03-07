"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedRoute } from "@/store/slices/searchSlice";
import { logger } from "@/lib/logger";
import { CompanyBadge } from "@/components/CompanyBadge";
import type { RouteItem } from "@/lib/companies/kmb/types";

const MAX_SUGGESTIONS = 20;
const DEBOUNCE_MS = 200;

function getUniqueRoutes(routeList: RouteItem[]): string[] {
  const seen = new Set<string>();
  return routeList
    .map((r) => r.route)
    .filter((route) => {
      if (seen.has(route)) return false;
      seen.add(route);
      return true;
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export interface RouteSearchInputProps {
  onFocus?: () => void;
}

export function RouteSearchInput({ onFocus }: RouteSearchInputProps) {
  const t = useTranslations("search");
  const dispatch = useAppDispatch();
  const routeList = useAppSelector((s) => s.companyCache.kmb?.routeList ?? []);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const uniqueRoutes = useMemo(() => getUniqueRoutes(routeList), [routeList]);

  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.trim().toUpperCase();
    return uniqueRoutes
      .filter((r) => r.toUpperCase().startsWith(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [uniqueRoutes, debouncedQuery]);

  const handleSelect = useCallback(
    (route: string) => {
      dispatch(setSelectedRoute(route));
      setQuery("");
      setIsOpen(false);
      logger.debug("Route selected", { route });
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
            suggestions.map((route) => (
              <li key={route}>
                <button
                  type="button"
                  onClick={() => handleSelect(route)}
                  className="w-full px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-amber-600 dark:text-amber-500">
                      {route}
                    </span>
                    <CompanyBadge companyId="kmb" />
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
