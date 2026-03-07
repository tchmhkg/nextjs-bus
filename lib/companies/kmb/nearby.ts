import { distanceMeters } from "@/lib/geo";
import type { RouteItem, RouteStopItem, StopItem } from "./types";
import { DEFAULT_SERVICE_TYPE } from "./utils";

export interface NearbyRouteItem {
  stopId: string;
  stopNameTc: string;
  stopNameEn: string;
  distanceMeters: number;
  route: string;
  bound: "O" | "I";
  serviceType: string;
  destTc: string;
  destEn: string;
}

export function getNearbyRoutes(
  stopList: StopItem[],
  routeStopList: RouteStopItem[],
  routeList: RouteItem[],
  userLat: number,
  userLong: number,
  radiusMeters: number
): NearbyRouteItem[] {
  const routeListByKey = new Map<string, RouteItem>();
  routeList.forEach((r) => {
    const key = `${r.route}-${r.bound}`;
    if (!routeListByKey.has(key)) routeListByKey.set(key, r);
  });

  const stopById = new Map<string, StopItem>();
  stopList.forEach((s) => stopById.set(s.stop.trim(), s));

  const results: NearbyRouteItem[] = [];

  for (const stop of stopList) {
    if (stop.lat == null || stop.long == null) continue;
    const dist = distanceMeters(userLat, userLong, stop.lat, stop.long);
    if (dist > radiusMeters) continue;

    const stopId = stop.stop.trim();
    const routeStops = routeStopList.filter(
      (rs) =>
        rs.stop.trim() === stopId && rs.service_type === DEFAULT_SERVICE_TYPE
    );
    const seen = new Set<string>();
    for (const rs of routeStops) {
      const key = `${rs.route}-${rs.bound}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const routeInfo = routeListByKey.get(key);
      results.push({
        stopId,
        stopNameTc: stop.name_tc,
        stopNameEn: stop.name_en,
        distanceMeters: dist,
        route: rs.route,
        bound: rs.bound,
        serviceType: rs.service_type,
        destTc: routeInfo?.dest_tc ?? "",
        destEn: routeInfo?.dest_en ?? "",
      });
    }
  }

  results.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return results;
}
