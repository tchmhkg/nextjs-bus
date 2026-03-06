export type TimeFormat = "12hr" | "24hr";

export function formatTime(
  isoString: string | null,
  timeFormat: TimeFormat,
  locale: string
): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: timeFormat === "12hr",
    });
  } catch {
    return "—";
  }
}

export function formatEtaWithRelative(
  eta: string | null,
  timeFormat: TimeFormat,
  locale: "en" | "zh-HK"
): string {
  if (!eta) return "—";
  try {
    const d = new Date(eta);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const exactTime = formatTime(
      eta,
      timeFormat,
      locale === "zh-HK" ? "zh-HK" : "en-HK"
    );
    if (diffMins <= 0) {
      return locale === "zh-HK"
        ? `${exactTime} (即將到站)`
        : `${exactTime} (Arriving)`;
    }
    if (diffMins < 60) {
      return locale === "zh-HK"
        ? `${exactTime} (${diffMins} 分鐘)`
        : `${exactTime} (${diffMins} min)`;
    }
    return exactTime;
  } catch {
    return "—";
  }
}
