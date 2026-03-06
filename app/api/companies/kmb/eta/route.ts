import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { fetchETA } from "@/lib/companies/kmb/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stopId = searchParams.get("stopId");
  const route = searchParams.get("route");
  const serviceType = searchParams.get("serviceType") ?? "1";

  if (!stopId || !route) {
    return NextResponse.json(
      { error: "Missing stopId or route" },
      { status: 400 }
    );
  }

  logger.info("ETA request", { stopId, route, serviceType });

  try {
    const data = await fetchETA(stopId, route, serviceType);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("ETA fetch failed", { error: message, stopId, route });

    return NextResponse.json(
      { error: "Failed to fetch ETA" },
      { status: 500 }
    );
  }
}
