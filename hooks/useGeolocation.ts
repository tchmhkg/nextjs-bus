"use client";

import { useState, useEffect, useCallback } from "react";

export interface GeolocationState {
  lat: number | null;
  long: number | null;
  error: string | null;
  loading: boolean;
}

const defaultState: GeolocationState = {
  lat: null,
  long: null,
  error: null,
  loading: true,
};

export interface UseGeolocationReturn extends GeolocationState {
  refetch: () => void;
}

export function useGeolocation(options?: PositionOptions): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>(defaultState);

  const request = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState({
        lat: null,
        long: null,
        error: "Geolocation not supported",
        loading: false,
      });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setState({
          lat: null,
          long: null,
          error: err.message || "Location unavailable",
          loading: false,
        });
      },
      options ?? { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, [options?.enableHighAccuracy, options?.timeout, options?.maximumAge]);

  useEffect(() => {
    request();
  }, [request]);

  return { ...state, refetch: request };
}
