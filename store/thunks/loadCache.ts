import { AppDispatch } from "@/store";
import { setCacheLoading, setCacheSuccess, setCacheError } from "@/store/slices/companyCacheSlice";
import { logger } from "@/lib/logger";

export async function loadCache(dispatch: AppDispatch): Promise<void> {
  dispatch(setCacheLoading());
  try {
    const res = await fetch("/api/companies/kmb/cache");
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error ?? "Failed to load cache");
    }
    dispatch(
      setCacheSuccess({
        routeList: json.routeList,
        stopList: json.stopList,
        routeStopList: json.routeStopList,
      })
    );
    logger.info("Cache loaded for company", { company: "kmb" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    dispatch(setCacheError(message));
    logger.error("Cache load failed", { error: message });
  }
}
