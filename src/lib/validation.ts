import { z } from "zod";
import {
  CONFIDENCE_LEVELS,
  MISTAKE_TYPES,
  REVIEW_RESULTS,
  TOPICS,
} from "@/lib/domain";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || z.url().safeParse(value).success, {
    message: "Enter a valid URL.",
  });

export const authSchema = z.object({
  email: z.email("Enter a valid email address.").trim(),
  password: z.string().min(8, "Use at least 8 characters."),
});

export const signupSchema = authSchema.extend({
  name: z.string().trim().min(2, "Enter your name.").max(60).optional(),
});

export const problemSchema = z.object({
  name: z.string().trim().min(3, "Add a problem name."),
  topic: z.enum(TOPICS),
  subtopic: z.string().trim().min(2, "Add a subtopic."),
  mistakeType: z.enum(MISTAKE_TYPES),
  notes: z.string().trim().max(2000, "Keep notes under 2000 characters.").optional(),
  solutionUrl: optionalUrl,
  difficulty: z.coerce.number().int().min(1).max(5),
});

export const reviewSchema = z.object({
  problemId: z.string().min(1),
  result: z.enum(REVIEW_RESULTS),
  confidence: z.enum(CONFIDENCE_LEVELS),
});

export type ProblemInput = z.infer<typeof problemSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;

export type ActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const INITIAL_ACTION_STATE: ActionState = {
  status: "idle",
};

export function toActionState(error: z.ZodError): ActionState {
  return {
    status: "error",
    message: "Please fix the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
  };
}
