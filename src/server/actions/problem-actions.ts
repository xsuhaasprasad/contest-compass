"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  INITIAL_ACTION_STATE,
  problemSchema,
  toActionState,
  type ActionState,
} from "@/lib/validation";
import { createProblemForUser } from "@/server/problems";

export async function createProblemAction(
  previousState: ActionState = INITIAL_ACTION_STATE,
  formData: FormData,
): Promise<ActionState> {
  void previousState;
  const user = await requireUser();
  const parsed = problemSchema.safeParse({
    name: formData.get("name"),
    topic: formData.get("topic"),
    subtopic: formData.get("subtopic"),
    mistakeType: formData.get("mistakeType"),
    notes: formData.get("notes"),
    solutionUrl: formData.get("solutionUrl"),
    difficulty: formData.get("difficulty"),
  });

  if (!parsed.success) {
    return toActionState(parsed.error);
  }

  await createProblemForUser(user.id, parsed.data);
  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/review");
  redirect("/review");
}
