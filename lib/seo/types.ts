import type { PrimarySport } from "@/types/user";
import type { RiderLevel, TrainingGoal } from "@/types/route";

export type SeoCity = {
  slug: string;
  name: string;
  country: string;
  region: "Europe" | "United States";
  lat: number;
  lng: number;
};

export type SeoDistancePage = {
  slug: string;
  sport: PrimarySport;
  valueKm: number;
  valueMiles: number;
  unitSlug: "km" | "mi";
  displayValue: number;
};

export type SeoTrainingPage = {
  slug: string;
  goal: TrainingGoal;
  level: RiderLevel;
  minutes: number;
  variant: string;
};

export type SeoZwiftRoutePage = {
  slug: string;
  worldSlug: string;
};
