"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { StopRow } from "./StopRow";
import { Card } from "@/components/ui/Card";
import { DEFAULT_SERVICE_TYPE } from "@/lib/companies/kmb/utils";
import type { StopItem } from "@/lib/companies/kmb/types";

export interface StopListProps {
  route: string;
  bound: "O" | "I";
}

export function StopList({ route, bound }: StopListProps) {
  const routeStopList = useAppSelector(
    (s) => s.companyCache.kmb?.routeStopList ?? []
  );
  const stopList = useAppSelector((s) => s.companyCache.kmb?.stopList ?? []);
  const expandedStopId = useAppSelector((s) => s.search.expandedStopId);
  const locale = useAppSelector((s) => s.lang.locale);

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
        };
      });
  }, [routeStopList, stopMap, route, bound]);

  return (
    <Card className="overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {stops.map((s) => (
          <StopRow
            key={`${s.stop}-${s.seq}`}
            stopId={s.stop.trim()}
            stopNameTc={s.stopNameTc}
            stopNameEn={s.stopNameEn}
            seq={s.seq}
            route={route}
            bound={bound}
            destTc={routeInfo?.dest_tc}
            destEn={routeInfo?.dest_en}
            isExpanded={expandedStopId === s.stop.trim()}
            locale={locale}
          />
        ))}
      </div>
    </Card>
  );
}
