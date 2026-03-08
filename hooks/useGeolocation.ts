"use client";

import { useState, useEffect, useCallback } from "react";

export interface GeolocationState {
  lat: number | null;
  long: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

const defaultState: GeolocationState = {
  lat: null,
  long: null,
  error: null,
  loading: true,
  permissionDenied: false,
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
        permissionDenied: false,
      });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null, permissionDenied: false }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (err) => {
        const isPermissionDenied = err.code === 1; // PERMISSION_DENIED
        setState({
          lat: null,
          long: null,
          error: isPermissionDenied
            ? "Location permission denied. Please enable location access in your browser settings."
            : err.message || "Location unavailable",
          loading: false,
          permissionDenied: isPermissionDenied,
        });
      },
      options ?? { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, [options]);

  useEffect(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, refetch: request };
}
