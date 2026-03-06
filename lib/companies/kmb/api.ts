import type {
  RouteListResponse,
  StopListResponse,
  RouteStopListResponse,
  ETAResponse,
} from "./types";

const API_BASE_URL = "https://data.etabus.gov.hk";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchRouteList(): Promise<RouteListResponse["data"]> {
  const url = `${API_BASE_URL}/v1/transport/kmb/route/`;
  const res = await fetchJson<RouteListResponse>(url);
  return res.data;
}

export async function fetchStopList(): Promise<StopListResponse["data"]> {
  const url = `${API_BASE_URL}/v1/transport/kmb/stop`;
  const res = await fetchJson<StopListResponse>(url);
  return res.data;
}

export async function fetchRouteStopList(): Promise<
  RouteStopListResponse["data"]
> {
  const url = `${API_BASE_URL}/v1/transport/kmb/route-stop`;
  const res = await fetchJson<RouteStopListResponse>(url);
  return res.data;
}

export async function fetchETA(
  stopId: string,
  route: string,
  serviceType: string
): Promise<ETAResponse["data"]> {
  const url = `${API_BASE_URL}/v1/transport/kmb/eta/${stopId}/${route}/${serviceType}`;
  const res = await fetchJson<ETAResponse>(url);
  return res.data;
}

export { API_BASE_URL };
