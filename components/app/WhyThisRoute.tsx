import type { TrainingGoal } from "@/types/route";
import {
  getTrainingGoalBenefit,
  getTrainingGoalLabel,
} from "@/types/route";

interface WhyThisRouteProps {
  availableTime: number;
  trainingGoal: TrainingGoal;
}

export function WhyThisRoute({ availableTime, trainingGoal }: WhyThisRouteProps) {
  const timeLabel = availableTime === 120 ? "120+" : String(availableTime);
  const benefit = getTrainingGoalBenefit(trainingGoal);
  const goalLabel = getTrainingGoalLabel(trainingGoal);

  return (
    <p className="result-why-text">
      This route matches your {timeLabel} minute window and focuses on {benefit}
      — ideal for your {goalLabel} goal today.
    </p>
  );
}
