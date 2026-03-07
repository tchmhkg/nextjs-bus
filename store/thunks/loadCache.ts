import { AppDispatch } from "@/store";
import { setCacheLoading, setCacheSuccess, setCacheError } from "@/store/slices/companyCacheSlice";
import { logger } from "@/lib/logger";

export async function loadCache(dispatch: AppDispatch): Promise<boolean> {
  dispatch(setCacheLoading());
  try {
    const res = await fetch("/api/companies/kmb/cache");
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error ?? `Failed to load cache (${res.status})`);
    }
    const { routeList, stopList, routeStopList } = json;
    if (
      !Array.isArray(routeList) ||
      !Array.isArray(stopList) ||
      !Array.isArray(routeStopList)
    ) {
      throw new Error("Invalid cache data");
    }
    dispatch(
      setCacheSuccess({
        routeList,
        stopList,
        routeStopList,
      })
    );
    logger.info("Cache loaded for company", { company: "kmb" });
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    dispatch(setCacheError(message));
    logger.error("Cache load failed", { error: message });
    return false;
  }
}
