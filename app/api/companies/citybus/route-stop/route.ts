import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  fetchCitybusRouteStopsForRoute,
  fetchCitybusStop,
} from "@/lib/companies/citybus/api";

interface CitybusRouteStopCacheEntry {
  routeStopList: Awaited<ReturnType<typeof fetchCitybusRouteStopsForRoute>>;
  stopList: NonNullable<Awaited<ReturnType<typeof fetchCitybusStop>>>[];
  cachedAt: number;
}

const CITYBUS_ROUTE_STOP_CACHE = new Map<string, CitybusRouteStopCacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheKey(route: string, direction: "inbound" | "outbound"): string {
  return `${route}|${direction}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get("route");
  const direction = searchParams.get("direction") as
    | "inbound"
    | "outbound"
    | null;

  if (!route || !direction) {
    return NextResponse.json(
      { error: "Missing route or direction" },
      { status: 400 }
    );
  }

  logger.info("Citybus route-stop request", { route, direction });

  try {
    const key = cacheKey(route, direction);
    const now = Date.now();

    const existing = CITYBUS_ROUTE_STOP_CACHE.get(key);
    if (existing && now - existing.cachedAt < CACHE_TTL_MS) {
      logger.info("Citybus route-stop cache hit", { route, direction });
      return NextResponse.json({
        routeStopList: existing.routeStopList,
        stopList: existing.stopList,
      });
    }

    const routeStopList = await fetchCitybusRouteStopsForRoute(route, direction);

    const uniqueStopIds = Array.from(
      new Set(routeStopList.map((rs) => rs.stop.trim()))
    );

    const stopResults = await Promise.all(
      uniqueStopIds.map(async (stopId) => {
        try {
          return await fetchCitybusStop(stopId);
        } catch {
          return null;
        }
      })
    );

    const stopList = stopResults.filter(
      (s): s is NonNullable<typeof s> => s != null
    );

    CITYBUS_ROUTE_STOP_CACHE.set(key, {
      routeStopList,
      stopList,
      cachedAt: now,
    });

    return NextResponse.json({
      routeStopList,
      stopList,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Citybus route-stop fetch failed", {
      error: message,
      route,
      direction,
    });

    return NextResponse.json(
      { error: "Failed to fetch Citybus route-stop data" },
      { status: 500 }
    );
  }
}

