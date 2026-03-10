import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  fetchRouteList,
  fetchStopList,
  fetchRouteStopList,
} from "@/lib/companies/kmb/api";
import { fetchCitybusRouteList } from "@/lib/companies/citybus/api";

type SupportedCompany = "kmb" | "ctb";

function isSupportedCompany(value: string): value is SupportedCompany {
  return value === "kmb" || value === "ctb";
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ company: string }> }
) {
  const { company } = await context.params;

  if (!isSupportedCompany(company)) {
    return NextResponse.json(
      { error: "Unsupported company" },
      { status: 400 }
    );
  }

  logger.info("Fetching cache (route, stop, route-stop)...", { company });

  try {
    let routeList: unknown[] = [];
    let stopList: unknown[] = [];
    let routeStopList: unknown[] = [];

    if (company === "kmb") {
      [routeList, stopList, routeStopList] = await Promise.all([
        fetchRouteList(),
        fetchStopList(),
        fetchRouteStopList(),
      ]);
    } else {
      // Citybus API only exposes a full route list; stop and route-stop
      // data must be fetched per-stop / per-route, so we leave those empty here.
      routeList = await fetchCitybusRouteList();
      stopList = [];
      routeStopList = [];
    }

    if (
      !Array.isArray(routeList) ||
      !Array.isArray(stopList) ||
      !Array.isArray(routeStopList)
    ) {
      logger.error("Cache invalid response shape", {
        company,
        routeListIsArray: Array.isArray(routeList),
        stopListIsArray: Array.isArray(stopList),
        routeStopListIsArray: Array.isArray(routeStopList),
      });
      return NextResponse.json(
        { error: "Invalid cache response from data source" },
        { status: 502 }
      );
    }

    logger.info("Cache loaded", {
      company,
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
    logger.error("Cache fetch failed", { error: message, company });

    return NextResponse.json(
      { error: "Failed to fetch cache" },
      { status: 500 }
    );
  }
}

