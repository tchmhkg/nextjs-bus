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
