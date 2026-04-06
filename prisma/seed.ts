import { hashSync } from "bcryptjs";
import { addDays, subDays } from "date-fns";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@contestcompass.app" },
    update: {},
    create: {
      email: "demo@contestcompass.app",
      name: "Demo Student",
      passwordHash: hashSync("MathRocks123", 10),
    },
  });

  await prisma.review.deleteMany({ where: { userId: user.id } });
  await prisma.problem.deleteMany({ where: { userId: user.id } });

  const problems = await Promise.all([
    prisma.problem.create({
      data: {
        userId: user.id,
        name: "2022 AMC 10B #15",
        topic: "Geometry",
        subtopic: "similar triangles",
        mistakeType: "WrongSetup",
        notes: "Forgot to chase the parallel lines before computing the ratio.",
        solutionUrl: "https://artofproblemsolving.com",
        difficulty: 4,
        status: "Active",
        nextReviewDate: subDays(new Date(), 2),
        intervalDays: 2,
        correctStreak: 1,
      },
    }),
    prisma.problem.create({
      data: {
        userId: user.id,
        name: "2021 AMC 12A #21",
        topic: "NumberTheory",
        subtopic: "modular arithmetic",
        mistakeType: "ConceptGap",
        notes: "Needed a cleaner residue table.",
        solutionUrl: "https://artofproblemsolving.com",
        difficulty: 5,
        status: "Mastered",
        nextReviewDate: addDays(new Date(), 8),
        intervalDays: 9,
        correctStreak: 2,
        masteredAt: subDays(new Date(), 3),
      },
    }),
    prisma.problem.create({
      data: {
        userId: user.id,
        name: "2019 AIME I #6",
        topic: "Combinatorics",
        subtopic: "casework",
        mistakeType: "TimePressure",
        notes: "Too many branches. Need a systematic table.",
        difficulty: 4,
        status: "Active",
        nextReviewDate: subDays(new Date(), 1),
        intervalDays: 1,
        correctStreak: 0,
      },
    }),
  ]);

  await prisma.review.createMany({
    data: [
      {
        userId: user.id,
        problemId: problems[0].id,
        reviewedAt: subDays(new Date(), 4),
        result: "Incorrect",
        confidence: "Medium",
        intervalBefore: 1,
        intervalAfter: 1,
        streakBefore: 0,
        streakAfter: 0,
        nextReviewDateAfter: subDays(new Date(), 3),
      },
      {
        userId: user.id,
        problemId: problems[0].id,
        reviewedAt: subDays(new Date(), 1),
        result: "Correct",
        confidence: "Low",
        intervalBefore: 1,
        intervalAfter: 2,
        streakBefore: 0,
        streakAfter: 1,
        nextReviewDateAfter: subDays(new Date(), 1),
      },
      {
        userId: user.id,
        problemId: problems[1].id,
        reviewedAt: subDays(new Date(), 5),
        result: "Correct",
        confidence: "High",
        intervalBefore: 3,
        intervalAfter: 9,
        streakBefore: 1,
        streakAfter: 2,
        nextReviewDateAfter: addDays(new Date(), 4),
      },
      {
        userId: user.id,
        problemId: problems[2].id,
        reviewedAt: subDays(new Date(), 2),
        result: "Incorrect",
        confidence: "Low",
        intervalBefore: 1,
        intervalAfter: 1,
        streakBefore: 1,
        streakAfter: 0,
        nextReviewDateAfter: subDays(new Date(), 1),
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
