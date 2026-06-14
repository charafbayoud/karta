export type Difficulty = "easy" | "moderate" | "hard" | "epic";

export type RiderLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "competitive";

export type TrainingGoal =
  | "recovery"
  | "endurance"
  | "climbing"
  | "challenge"
  | "surprise";

export type AvailableTime = 30 | 45 | 60 | 90 | 120;

export interface Route {
  id: string;
  route_name: string;
  world: string;
  continent: string;
  distance_km: number;
  elevation_m: number;
  difficulty: Difficulty;
  estimated_time_beginner: number;
  estimated_time_intermediate: number;
  estimated_time_advanced: number;
  estimated_time_competitive: number;
  training_tags: string[];
}

export interface RecommendationRequest {
  availableTime: AvailableTime;
  riderLevel: RiderLevel;
  trainingGoal: TrainingGoal;
}

export interface RecommendationResult {
  route: Route;
  estimatedDuration: number;
  adjusted: boolean;
  note?: string;
}

export const RIDER_LEVEL_LABELS: Record<RiderLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  competitive: "Competitive",
};

export const TRAINING_GOAL_LABELS: Record<TrainingGoal, string> = {
  recovery: "Recovery",
  endurance: "Endurance",
  climbing: "Climbing",
  challenge: "Challenge",
  surprise: "Surprise Me",
};

export const AVAILABLE_TIME_OPTIONS: AvailableTime[] = [30, 45, 60, 90, 120];

export const RIDER_LEVELS: RiderLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "competitive",
];

export const TRAINING_GOALS: TrainingGoal[] = [
  "recovery",
  "endurance",
  "climbing",
  "challenge",
  "surprise",
];

export function getEstimatedTime(route: Route, level: RiderLevel): number {
  const map: Record<RiderLevel, number> = {
    beginner: route.estimated_time_beginner,
    intermediate: route.estimated_time_intermediate,
    advanced: route.estimated_time_advanced,
    competitive: route.estimated_time_competitive,
  };
  return map[level];
}

export function getTrainingGoalBenefit(goal: TrainingGoal): string {
  const benefits: Record<TrainingGoal, string> = {
    recovery: "low-intensity spinning and gentle terrain",
    endurance: "steady aerobic effort over rolling roads",
    climbing: "vertical gain and sustained power",
    challenge: "maximum difficulty and epic terrain",
    surprise: "something fresh you might never pick yourself",
  };
  return benefits[goal];
}

export function getTrainingGoalLabel(goal: TrainingGoal): string {
  if (goal === "surprise") return "surprise";
  return TRAINING_GOAL_LABELS[goal].toLowerCase();
}
