 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setExpandedStopId } from "@/store/slices/searchSlice";
import { useGeolocation } from "@/hooks/useGeolocation";
import { StopRow } from "./StopRow";
import { Card } from "@/components/ui/Card";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";
import type {
  RouteItem as KmbRouteItem,
  RouteStopItem as KmbRouteStopItem,
} from "@/lib/companies/kmb/types";
import { distanceMeters } from "@/lib/geo";
import type { StopItem as KmbStopItem } from "@/lib/companies/kmb/types";
import type {
  CitybusStopItem,
  CitybusRouteStopItem,
} from "@/lib/companies/citybus/types";

export interface StopListProps {
  route: string;
  bound: "O" | "I";
}

interface EnrichedStop {
  stop: string;
  seq: number;
  stopNameTc: string;
  stopNameEn: string;
  lat?: number;
  long?: number;
}

export function StopList({ route, bound }: StopListProps) {
  const dispatch = useAppDispatch();
  const selectedCompanyId = useAppSelector(
    (s) => s.company.selectedCompanyId
  );
  const routeStopList = useAppSelector(
    (s) => s.companyCache[selectedCompanyId]?.routeStopList ?? []
  );
  const stopList = useAppSelector(
    (s) => s.companyCache[selectedCompanyId]?.stopList ?? []
  );
  const expandedStopId = useAppSelector((s) => s.search.expandedStopId);
  const locale = useAppSelector((s) => s.lang.locale);
  const { lat, long } = useGeolocation();
  const nearbyRangeMeters = useAppSelector(
    (s) => s.settings.nearbyRangeMeters
  );
  const nearestRowRef = useRef<HTMLDivElement | null>(null);

  const [ctbRouteStops, setCtbRouteStops] = useState<CitybusRouteStopItem[]>(
    []
  );
  const [ctbStops, setCtbStops] = useState<CitybusStopItem[]>([]);

  useEffect(() => {
    if (selectedCompanyId !== "ctb") return;
    setCtbRouteStops([]);
    setCtbStops([]);

    const controller = new AbortController();
    const direction = bound === "I" ? "inbound" : "outbound";

    (async () => {
      try {
        const res = await fetch(
          `/api/companies/citybus/route-stop?route=${encodeURIComponent(
            route
          )}&direction=${direction}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        if (!res.ok || !json.routeStopList || !json.stopList) return;
        setCtbRouteStops(json.routeStopList as CitybusRouteStopItem[]);
        setCtbStops(json.stopList as CitybusStopItem[]);
      } catch {
        // ignore errors for now; UI will just show no stops
      }
    })();

    return () => controller.abort();
  }, [route, bound, selectedCompanyId]);

  const stopMap = useMemo(() => {
    const m = new Map<string, KmbStopItem | CitybusStopItem>();
    if (selectedCompanyId === "kmb") {
      stopList.forEach((s) =>
        m.set(s.stop.trim(), s as KmbStopItem | CitybusStopItem)
      );
    } else {
      ctbStops.forEach((s) =>
        m.set(s.stop.trim(), s as KmbStopItem | CitybusStopItem)
      );
    }
    return m;
  }, [stopList, ctbStops, selectedCompanyId]);

  const routeList = useAppSelector(
    (s) =>
      s.companyCache[selectedCompanyId]?.routeList as
        | KmbRouteItem[]
        | undefined ?? []
  );
  const routeInfo = useMemo(
    () =>
      routeList.find((r) => {
        const anyRoute = r as KmbRouteItem;
        return anyRoute.route === route && anyRoute.bound === bound;
      }),
    [routeList, route, bound]
  );

  const stops: EnrichedStop[] = useMemo(() => {
    if (selectedCompanyId === "ctb") {
      return ctbRouteStops
        .filter(
          (rs) =>
            rs.route === route &&
            rs.dir === bound
        )
        .sort((a, b) => a.seq - b.seq)
        .map((rs) => {
          const stop = stopMap.get(rs.stop.trim());
          return {
            stop: rs.stop,
            seq: rs.seq,
            stopNameTc: stop?.name_tc ?? rs.stop,
            stopNameEn: stop?.name_en ?? rs.stop,
            lat: stop?.lat,
            long: stop?.long,
          };
        });
    }

    return (routeStopList as KmbRouteStopItem[])
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
          stop: rs.stop,
          seq: rs.seq,
          stopNameTc: stop?.name_tc ?? rs.stop,
          stopNameEn: stop?.name_en ?? rs.stop,
          lat: stop?.lat,
          long: stop?.long,
        };
      });
  }, [selectedCompanyId, ctbRouteStops, routeStopList, stopMap, route, bound]);

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
