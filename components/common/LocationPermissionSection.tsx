"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

type PermissionState = "unknown" | "granted" | "denied" | "prompt";

export function LocationPermissionSection() {
  const t = useTranslations("settings");
  const [permissionState, setPermissionState] = useState<PermissionState>("unknown");
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setPermissionState(result.state as PermissionState);
          result.addEventListener("change", () => {
            setPermissionState(result.state as PermissionState);
          });
        })
        .catch(() => {
          // Fallback for browsers that don't support permissions API
          setPermissionState("unknown");
        });
    }
  }, []);

  const requestPermission = async () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsRequesting(true);
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(),
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              reject(new Error("denied"));
            } else {
              reject(error);
            }
          },
          { timeout: 10000 }
        );
      });
      setPermissionState("granted");
    } catch (error) {
      if (error instanceof Error && error.message === "denied") {
        setPermissionState("denied");
      }
      // For other errors, keep current state
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusText = () => {
    switch (permissionState) {
      case "granted":
        return t("locationPermissionGranted");
      case "denied":
        return t("locationPermissionDenied");
      case "prompt":
        return t("locationPermissionPrompt");
      default:
        return t("locationPermissionUnknown");
    }
  };

  const getStatusColor = () => {
    switch (permissionState) {
      case "granted":
        return "text-green-600 dark:text-green-500";
      case "denied":
        return "text-red-600 dark:text-red-500";
      case "prompt":
        return "text-amber-600 dark:text-amber-500";
      default:
        return "text-zinc-500";
    }
  };

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="mb-3 font-medium text-zinc-900 dark:text-zinc-50">
        {t("locationPermission")}
      </h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("locationPermissionStatus")}
          </span>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={requestPermission}
            disabled={isRequesting || permissionState === "granted"}
            variant={permissionState === "granted" ? "secondary" : "primary"}
          >
            {isRequesting
              ? t("loading")
              : permissionState === "granted"
              ? t("locationPermissionGranted")
              : t("locationPermissionRequest")}
          </Button>
          {permissionState === "denied" && (
            <span className="text-xs text-zinc-500">
              {t("locationPermissionInstructions")}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}