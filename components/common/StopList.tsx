"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setExpandedStopId } from "@/store/slices/searchSlice";
import { useGeolocation } from "@/hooks/useGeolocation";
import { StopRow } from "./StopRow";
import { Card } from "@/components/ui/Card";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";
import { distanceMeters } from "@/lib/geo";
import type { StopItem } from "@/lib/companies/kmb/types";

export interface StopListProps {
  route: string;
  bound: "O" | "I";
}

export function StopList({ route, bound }: StopListProps) {
  const dispatch = useAppDispatch();
  const routeStopList = useAppSelector(
    (s) => s.companyCache.kmb?.routeStopList ?? []
  );
  const stopList = useAppSelector((s) => s.companyCache.kmb?.stopList ?? []);
  const expandedStopId = useAppSelector((s) => s.search.expandedStopId);
  const locale = useAppSelector((s) => s.lang.locale);
  const { lat, long } = useGeolocation();
  const nearbyRangeMeters = useAppSelector(
    (s) => s.settings.nearbyRangeMeters
  );
  const nearestRowRef = useRef<HTMLDivElement | null>(null);

  const stopMap = useMemo(() => {
    const m = new Map<string, StopItem>();
    stopList.forEach((s) => m.set(s.stop.trim(), s));
    return m;
  }, [stopList]);

  const routeList = useAppSelector((s) => s.companyCache.kmb?.routeList ?? []);
  const routeInfo = useMemo(
    () => routeList.find((r) => r.route === route && r.bound === bound),
    [routeList, route, bound]
  );

  const stops = useMemo(() => {
    return routeStopList
      .filter(
        (rs) =>
          rs.route === route &&
          rs.bound === bound &&
          rs.service_type === DEFAULT_SERVICE_TYPE
      )
      .sort((a, b) => a.seq - b.seq)
      .map((rs) => {
        const stop = stopMap.get(rs.stop.trim());
        return {
          ...rs,
          stopNameTc: stop?.name_tc ?? rs.stop,
          stopNameEn: stop?.name_en ?? rs.stop,
          lat: stop?.lat,
          long: stop?.long,
        };
      });
  }, [routeStopList, stopMap, route, bound]);

  const nearestStopId = useMemo(() => {
    if (lat == null || long == null || stops.length === 0) return null;
    let nearestId: string | null = null;
    let minDist = Infinity;
    for (const s of stops) {
      if (s.lat == null || s.long == null) continue;
      const d = distanceMeters(lat, long, s.lat, s.long);
      if (d < minDist) {
        minDist = d;
        nearestId = s.stop.trim();
      }
    }
    if (nearestId == null || minDist > nearbyRangeMeters) return null;
    return nearestId;
  }, [lat, long, stops, nearbyRangeMeters]);

  useEffect(() => {
    if (nearestStopId == null || !nearestRowRef.current) return;
    dispatch(setExpandedStopId(nearestStopId));
    const el = nearestRowRef.current;
    const t = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => cancelAnimationFrame(t);
  }, [route, bound, nearestStopId, dispatch]);

  return (
    <Card className="overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {stops.map((s) => {
          const stopId = s.stop.trim();
          const isNearest = nearestStopId === stopId;
          return (
            <div
              key={`${s.stop}-${s.seq}`}
              ref={isNearest ? nearestRowRef : undefined}
            >
              <StopRow
                stopId={stopId}
                stopNameTc={s.stopNameTc}
                stopNameEn={s.stopNameEn}
                seq={s.seq}
                route={route}
                bound={bound}
                destTc={routeInfo?.dest_tc}
                destEn={routeInfo?.dest_en}
                isExpanded={expandedStopId === stopId}
                locale={locale}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
