"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { scheduleNextReview } from "@/lib/review-scheduler";
import {
  INITIAL_ACTION_STATE,
  reviewSchema,
  toActionState,
  type ActionState,
} from "@/lib/validation";

export async function submitReviewAction(
  previousState: ActionState = INITIAL_ACTION_STATE,
  formData: FormData,
): Promise<ActionState> {
  void previousState;
  const user = await requireUser();
  const parsed = reviewSchema.safeParse({
    problemId: formData.get("problemId"),
    result: formData.get("result"),
    confidence: formData.get("confidence"),
  });

  if (!parsed.success) {
    return toActionState(parsed.error);
  }

  const problem = await prisma.problem.findFirst({
    where: {
      id: parsed.data.problemId,
      userId: user.id,
    },
  });

  if (!problem) {
    return {
      status: "error",
      message: "That problem could not be found.",
    };
  }

  const scheduled = scheduleNextReview({
    result: parsed.data.result,
    confidence: parsed.data.confidence,
    intervalDays: problem.intervalDays,
    correctStreak: problem.correctStreak,
  });

  await prisma.$transaction([
    prisma.review.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        result: parsed.data.result,
        confidence: parsed.data.confidence,
        intervalBefore: problem.intervalDays,
        intervalAfter: scheduled.intervalDays,
        streakBefore: problem.correctStreak,
        streakAfter: scheduled.correctStreak,
        nextReviewDateAfter: scheduled.nextReviewDate,
      },
    }),
    prisma.problem.update({
      where: { id: problem.id },
      data: {
        intervalDays: scheduled.intervalDays,
        correctStreak: scheduled.correctStreak,
        nextReviewDate: scheduled.nextReviewDate,
        status: scheduled.status,
        masteredAt: scheduled.masteredAt,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/review");
  redirect("/review");
}
