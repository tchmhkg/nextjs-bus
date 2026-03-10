import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { fetchETA as fetchKmbETA } from "@/lib/companies/kmb/api";
import { fetchCitybusETA } from "@/lib/companies/citybus/api";

type SupportedCompany = "kmb" | "ctb";

function isSupportedCompany(value: string): value is SupportedCompany {
  return value === "kmb" || value === "ctb";
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ company: string }> }
) {
  const { company } = await context.params;
  const { searchParams } = new URL(request.url);
  const stopId = searchParams.get("stopId");
  const route = searchParams.get("route");
  const serviceType = searchParams.get("serviceType") ?? "1";
  const directionParam = searchParams.get("direction") as
    | "inbound"
    | "outbound"
    | null;

  if (!isSupportedCompany(company)) {
    return NextResponse.json(
      { error: "Unsupported company" },
      { status: 400 }
    );
  }

  if (!stopId || !route) {
    return NextResponse.json(
      { error: "Missing stopId or route" },
      { status: 400 }
    );
  }

  logger.info("ETA request", { company, stopId, route, serviceType, direction: directionParam });

  try {
    let data: unknown[];

    if (company === "kmb") {
      data = await fetchKmbETA(stopId, route, serviceType);
    } else {
      // Citybus ETA V2 endpoint does not take direction; it returns ETAs
      // for the specified stop and route, and each item carries its own dir.
      data = await fetchCitybusETA(stopId, route);
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("ETA fetch failed", { error: message, company, stopId, route });

    return NextResponse.json(
      { error: "Failed to fetch ETA" },
      { status: 500 }
    );
  }
}

