const KM_TO_MI = 0.621371;

export function kmToMiles(km: number): number {
  return Math.round(km * KM_TO_MI * 10) / 10;
}

export function milesToKm(miles: number): number {
  return Math.round((miles / KM_TO_MI) * 10) / 10;
}

export function formatKm(km: number): string {
  return Number.isInteger(km) ? `${km} km` : `${km.toFixed(1)} km`;
}

export function formatMiles(miles: number): string {
  return Number.isInteger(miles) ? `${miles} mi` : `${miles.toFixed(1)} mi`;
}
