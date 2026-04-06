import assert from "node:assert/strict";
import { scheduleNextReview } from "@/lib/review-scheduler";

{
  const result = scheduleNextReview({
    result: "Incorrect",
    confidence: "High",
    intervalDays: 7,
    correctStreak: 1,
    referenceDate: new Date("2026-04-05T12:00:00.000Z"),
  });

  assert.equal(result.intervalDays, 1);
  assert.equal(result.correctStreak, 0);
  assert.equal(result.status, "Active");
}

{
  const result = scheduleNextReview({
    result: "Correct",
    confidence: "High",
    intervalDays: 3,
    correctStreak: 0,
    referenceDate: new Date("2026-04-05T12:00:00.000Z"),
  });

  assert.equal(result.intervalDays, 9);
  assert.equal(result.correctStreak, 1);
  assert.equal(result.status, "Active");
}

{
  const result = scheduleNextReview({
    result: "Correct",
    confidence: "Medium",
    intervalDays: 2,
    correctStreak: 1,
    referenceDate: new Date("2026-04-05T12:00:00.000Z"),
  });

  assert.equal(result.status, "Mastered");
  assert.equal(result.correctStreak, 2);
  assert.ok(result.masteredAt);
}

console.log("review-scheduler tests passed");
