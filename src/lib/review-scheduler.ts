import { addDays, startOfDay } from "date-fns";
import type { ConfidenceLevel, ProblemStatus, ReviewResult } from "@/lib/domain";

const CONFIDENCE_MULTIPLIERS: Record<ConfidenceLevel, number> = {
  Low: 1.5,
  Medium: 2,
  High: 3,
};

type ScheduleInput = {
  result: ReviewResult;
  confidence: ConfidenceLevel;
  intervalDays: number;
  correctStreak: number;
  referenceDate?: Date;
};

type ScheduleOutput = {
  intervalDays: number;
  correctStreak: number;
  nextReviewDate: Date;
  status: ProblemStatus;
  masteredAt: Date | null;
};

export function scheduleNextReview({
  result,
  confidence,
  intervalDays,
  correctStreak,
  referenceDate = new Date(),
}: ScheduleInput): ScheduleOutput {
  const today = startOfDay(referenceDate);

  if (result === "Incorrect") {
    return {
      intervalDays: 1,
      correctStreak: 0,
      nextReviewDate: addDays(today, 1),
      status: "Active",
      masteredAt: null,
    };
  }

  const nextStreak = correctStreak + 1;
  const nextInterval = Math.max(
    intervalDays + 1,
    Math.ceil(intervalDays * CONFIDENCE_MULTIPLIERS[confidence]),
  );
  const status: ProblemStatus = nextStreak >= 2 ? "Mastered" : "Active";

  return {
    intervalDays: nextInterval,
    correctStreak: nextStreak,
    nextReviewDate: addDays(today, nextInterval),
    status,
    masteredAt: status === "Mastered" ? today : null,
  };
}
