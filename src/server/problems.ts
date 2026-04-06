import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/db";
import type { MistakeType, ProblemStatus, Topic } from "@/lib/domain";
import type { ProblemInput } from "@/lib/validation";

export async function createProblemForUser(userId: string, input: ProblemInput) {
  const today = startOfDay(new Date());

  return prisma.problem.create({
    data: {
      userId,
      name: input.name,
      topic: input.topic,
      subtopic: input.subtopic,
      mistakeType: input.mistakeType,
      notes: input.notes,
      solutionUrl: input.solutionUrl,
      difficulty: input.difficulty,
      status: "Active",
      nextReviewDate: today,
      intervalDays: 1,
      correctStreak: 0,
    },
  });
}

export async function getDueProblems(userId: string) {
  return prisma.problem.findMany({
    where: {
      userId,
      status: "Active",
      nextReviewDate: {
        lte: endOfDay(new Date()),
      },
    },
    orderBy: [{ nextReviewDate: "asc" }, { createdAt: "asc" }],
    include: {
      reviews: {
        orderBy: { reviewedAt: "desc" },
        take: 3,
      },
    },
  });
}

export type HistoryFilters = {
  query?: string;
  topic?: Topic;
  mistakeType?: MistakeType;
  status?: ProblemStatus;
};

export async function getProblemHistory(userId: string, filters: HistoryFilters) {
  const problems = await prisma.problem.findMany({
    where: {
      userId,
      topic: filters.topic,
      mistakeType: filters.mistakeType,
      status: filters.status,
      OR: filters.query
        ? [
            { name: { contains: filters.query, mode: "insensitive" } },
            { subtopic: { contains: filters.query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { updatedAt: "desc" },
    include: {
      reviews: {
        orderBy: { reviewedAt: "desc" },
      },
    },
  });

  return problems.map((problem) => {
    const correctReviews = problem.reviews.filter((review) => review.result === "Correct").length;
    const lastReview = problem.reviews[0] ?? null;

    return {
      ...problem,
      attempts: problem.reviews.length,
      accuracy: problem.reviews.length
        ? Math.round((correctReviews / problem.reviews.length) * 100)
        : 0,
      lastReview,
    };
  });
}
