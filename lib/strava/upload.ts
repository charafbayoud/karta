import { STRAVA_API_BASE } from "@/lib/strava/config";
import { getValidStravaAccessToken } from "@/lib/strava/tokens";

type StravaUploadResponse = {
  id: number;
  activity_id?: number;
  error?: string;
  status?: string;
};

export async function uploadGpxToStrava(input: {
  userId: string;
  gpx: string;
  name: string;
  description?: string;
  activityType?: "ride" | "run" | "walk";
}): Promise<{ uploadId: number; activityId?: number }> {
  const accessToken = await getValidStravaAccessToken(input.userId);
  if (!accessToken) {
    throw new Error("Connecte ton compte Strava avant de publier.");
  }

  const form = new FormData();
  form.append(
    "file",
    new Blob([input.gpx], { type: "application/gpx+xml" }),
    "karta-gps-art.gpx"
  );
  form.append("name", input.name);
  form.append("data_type", "gpx");
  form.append("activity_type", input.activityType ?? "ride");
  if (input.description) {
    form.append("description", input.description);
  }

  const response = await fetch(`${STRAVA_API_BASE}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  const data = (await response.json()) as StravaUploadResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Strava a refusé l'upload.");
  }

  return {
    uploadId: data.id,
    activityId: data.activity_id,
  };
}
