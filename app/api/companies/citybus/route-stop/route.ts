import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  fetchCitybusRouteStopsForRoute,
  fetchCitybusStop,
} from "@/lib/companies/citybus/api";

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
    const routeStopList = await fetchCitybusRouteStopsForRoute(
      route,
      direction
    );

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

