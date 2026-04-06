import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { authSchema } from "@/lib/validation";

const SESSION_COOKIE = "contest-compass-session";
const encoder = new TextEncoder();

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return encoder.encode(secret);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getAuthSecret());
    const userId = verified.payload.sub;

    if (!userId) {
      return null;
    }

    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function authenticate(email: string, password: string) {
  const parsed = authSchema.safeParse({ email, password });

  if (!parsed.success) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email.toLowerCase(),
    },
  });

  if (!user) {
    return null;
  }

  const passwordMatches = await compare(parsed.data.password, user.passwordHash);

  return passwordMatches ? user : null;
}
