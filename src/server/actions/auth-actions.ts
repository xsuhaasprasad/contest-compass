"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { authenticate, clearSession, createSession, getCurrentUser } from "@/lib/auth";
import {
  INITIAL_ACTION_STATE,
  authSchema,
  signupSchema,
  toActionState,
  type ActionState,
} from "@/lib/validation";

export async function signUpAction(
  previousState: ActionState = INITIAL_ACTION_STATE,
  formData: FormData,
): Promise<ActionState> {
  void previousState;
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return toActionState(parsed.error);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existingUser) {
    return {
      status: "error",
      message: "That email already has an account.",
    };
  }

  await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name || undefined,
      passwordHash: await hash(parsed.data.password, 10),
    },
  });

  redirect("/login?created=1");
}

export async function signInAction(
  previousState: ActionState = INITIAL_ACTION_STATE,
  formData: FormData,
): Promise<ActionState> {
  void previousState;
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return toActionState(parsed.error);
  }

  const user = await authenticate(parsed.data.email, parsed.data.password);

  if (!user) {
    return {
      status: "error",
      message: "Incorrect email or password.",
    };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }
}
