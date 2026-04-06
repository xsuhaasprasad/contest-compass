import { eachDayOfInterval, startOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/db";
import {
  MISTAKE_TYPE_LABELS,
  TOPIC_LABELS,
  type MistakeType,
  type Topic,
} from "@/lib/domain";
import { percent } from "@/lib/utils";

export async function getDashboardData(userId: string) {
  const [problems, reviews] = await Promise.all([
    prisma.problem.findMany({
      where: { userId },
      select: {
        id: true,
        topic: true,
        subtopic: true,
        mistakeType: true,
        status: true,
      },
    }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { reviewedAt: "asc" },
      select: {
        reviewedAt: true,
        result: true,
        problem: {
          select: {
            topic: true,
            subtopic: true,
            mistakeType: true,
          },
        },
      },
    }),
  ]);

  const activeCount = problems.filter((problem) => problem.status === "Active").length;
  const masteredCount = problems.filter((problem) => problem.status === "Mastered").length;
  const correctReviews = reviews.filter((review) => review.result === "Correct").length;
  const incorrectReviews = reviews.length - correctReviews;

  const topicBuckets = new Map<Topic, { total: number; incorrect: number }>();
  const subtopicFailures = new Map<string, number>();
  const mistakeDistribution = new Map<MistakeType, number>();
  const resetBuckets = new Map<MistakeType, number>();
  const reviewsByDay = new Map<string, { total: number; correct: number }>();

  for (const problem of problems) {
    mistakeDistribution.set(
      problem.mistakeType,
      (mistakeDistribution.get(problem.mistakeType) ?? 0) + 1,
    );
  }

  for (const review of reviews) {
    const topic = review.problem.topic;
    const topicEntry = topicBuckets.get(topic) ?? { total: 0, incorrect: 0 };
    topicEntry.total += 1;

    if (review.result === "Incorrect") {
      topicEntry.incorrect += 1;
      subtopicFailures.set(
        review.problem.subtopic,
        (subtopicFailures.get(review.problem.subtopic) ?? 0) + 1,
      );
      resetBuckets.set(
        review.problem.mistakeType,
        (resetBuckets.get(review.problem.mistakeType) ?? 0) + 1,
      );
    }

    topicBuckets.set(topic, topicEntry);

    const dayKey = startOfDay(review.reviewedAt).toISOString();
    const dayEntry = reviewsByDay.get(dayKey) ?? { total: 0, correct: 0 };
    dayEntry.total += 1;
    if (review.result === "Correct") {
      dayEntry.correct += 1;
    }
    reviewsByDay.set(dayKey, dayEntry);
  }

  const today = startOfDay(new Date());
  const heatmap = eachDayOfInterval({
    start: subDays(today, 41),
    end: today,
  }).map((day) => {
    const key = day.toISOString();
    const count = reviewsByDay.get(key)?.total ?? 0;

    return {
      date: key,
      count,
      level: count >= 6 ? 4 : count >= 4 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0,
    };
  });

  return {
    stats: {
      totalProblems: problems.length,
      activeCount,
      masteredCount,
      reviewSuccessRate: percent(correctReviews, reviews.length),
      incorrectReviews,
    },
    topicAnalysis: Array.from(topicBuckets.entries()).map(([topic, bucket]) => ({
      topic,
      label: TOPIC_LABELS[topic],
      incorrectRate: percent(bucket.incorrect, bucket.total),
      incorrect: bucket.incorrect,
      total: bucket.total,
    })),
    subtopicFailures: Array.from(subtopicFailures.entries())
      .map(([subtopic, failures]) => ({ subtopic, failures }))
      .sort((a, b) => b.failures - a.failures)
      .slice(0, 5),
    mistakeDistribution: Array.from(mistakeDistribution.entries()).map(([mistakeType, count]) => ({
      mistakeType,
      label: MISTAKE_TYPE_LABELS[mistakeType],
      count,
    })),
    mistakeResets: Array.from(resetBuckets.entries())
      .map(([mistakeType, resets]) => ({
        mistakeType,
        label: MISTAKE_TYPE_LABELS[mistakeType],
        resets,
      }))
      .sort((a, b) => b.resets - a.resets),
    accuracyTrend: Array.from(reviewsByDay.entries()).map(([date, value]) => ({
      date,
      accuracy: percent(value.correct, value.total),
      reviews: value.total,
    })),
    heatmap,
  };
}
