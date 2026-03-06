import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  fetchRouteList,
  fetchStopList,
  fetchRouteStopList,
} from "@/lib/companies/kmb/api";

export async function GET() {
  logger.info("Fetching KMB cache (route, stop, route-stop)...");

  try {
    const [routeList, stopList, routeStopList] = await Promise.all([
      fetchRouteList(),
      fetchStopList(),
      fetchRouteStopList(),
    ]);

    logger.info("KMB cache loaded", {
      routeCount: routeList.length,
      stopCount: stopList.length,
      routeStopCount: routeStopList.length,
    });

    return NextResponse.json({
      routeList,
      stopList,
      routeStopList,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("KMB cache fetch failed", { error: message });

    return NextResponse.json(
      { error: "Failed to fetch KMB cache" },
      { status: 500 }
    );
  }
}
