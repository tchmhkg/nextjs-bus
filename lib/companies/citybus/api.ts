import type {
  CitybusRouteListResponse,
  CitybusStopListResponse,
  CitybusRouteStopListResponse,
  CitybusETAResponse,
  CitybusStopItem,
} from "./types";

const CITYBUS_API_BASE_URL = "https://rt.data.gov.hk/v2/transport/citybus";
const CITYBUS_COMPANY_ID = "CTB";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchCitybusRouteList(): Promise<
  CitybusRouteListResponse["data"]
> {
  const url = `${CITYBUS_API_BASE_URL}/route/${CITYBUS_COMPANY_ID}`;
  const res = await fetchJson<CitybusRouteListResponse>(url);
  const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
  return data;
}

export async function fetchCitybusRouteStopsForRoute(
  route: string,
  direction: "inbound" | "outbound"
): Promise<CitybusRouteStopListResponse["data"]> {
  const url = `${CITYBUS_API_BASE_URL}/route-stop/${CITYBUS_COMPANY_ID}/${encodeURIComponent(
    route
  )}/${direction}`;
  const res = await fetchJson<CitybusRouteStopListResponse>(url);
  const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
  return data;
}

export async function fetchCitybusStop(
  stopId: string
): Promise<CitybusStopItem | null> {
  const url = `${CITYBUS_API_BASE_URL}/stop/${encodeURIComponent(stopId)}`;
  const res = await fetchJson<CitybusStopListResponse>(url);
  if (!res.data) return null;
  // Citybus Stop API returns a single object in `data`
  return res.data as unknown as CitybusStopItem;
}

export async function fetchCitybusETA(
  stopId: string,
  route: string
): Promise<CitybusETAResponse["data"]> {
  const url = `${CITYBUS_API_BASE_URL}/eta/${CITYBUS_COMPANY_ID}/${encodeURIComponent(
    stopId
  )}/${encodeURIComponent(route)}`;
  const res = await fetchJson<CitybusETAResponse>(url);
  const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
  return data;
}

export { CITYBUS_API_BASE_URL };

