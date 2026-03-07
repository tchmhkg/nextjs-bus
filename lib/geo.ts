/**
 * Haversine distance in meters between two WGS84 coordinates.
 */
export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function formatDistance(meters: number, locale: string): string {
  if (meters < 1000) {
    return locale === "zh-HK" ? `${Math.round(meters)} 米` : `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return locale === "zh-HK" ? `${km.toFixed(1)} 公里` : `${km.toFixed(1)} km`;
}
