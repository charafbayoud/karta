function isPlaceholder(value: string | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function getGoogleMapsApiKey(): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return isPlaceholder(key) ? null : key!;
}

export function getGoogleRoadsApiKey(): string | null {
  const key =
    process.env.GOOGLE_ROADS_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return isPlaceholder(key) ? null : key!;
}

export function getGoogleRoutesApiKey(): string | null {
  const key =
    process.env.GOOGLE_ROUTES_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return isPlaceholder(key) ? null : key!;
}

export function isGoogleMapsConfigured(): boolean {
  return getGoogleMapsApiKey() !== null;
}

export function isGoogleRoadsConfigured(): boolean {
  return getGoogleRoadsApiKey() !== null;
}

export function isGoogleRoutesConfigured(): boolean {
  return getGoogleRoutesApiKey() !== null;
}
