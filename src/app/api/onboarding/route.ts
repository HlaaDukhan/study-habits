import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  // Update profile with self-assessment
  await prisma.userProfile.upsert({
    where: { userId },
    update: {
      selfAssessment: JSON.stringify({
        studyGoal: body.studyGoal,
        biggestChallenge: body.biggestChallenge,
        preferredTime: body.preferredTime,
        typicalHours: body.typicalHours,
      }),
      studyGoal: body.studyGoal,
      biggestChallenge: body.biggestChallenge,
      preferredTime: body.preferredTime,
      typicalStudyHours: body.typicalHours ? parseFloat(body.typicalHours) : null,
      onboardingComplete: true,
    },
    create: {
      userId,
      selfAssessment: JSON.stringify({
        studyGoal: body.studyGoal,
        biggestChallenge: body.biggestChallenge,
        preferredTime: body.preferredTime,
        typicalHours: body.typicalHours,
      }),
      studyGoal: body.studyGoal,
      biggestChallenge: body.biggestChallenge,
      preferredTime: body.preferredTime,
      typicalStudyHours: body.typicalHours ? parseFloat(body.typicalHours) : null,
      onboardingComplete: true,
    },
  });

  // Create event if provided
  if (body.eventName && body.eventDate) {
    await prisma.event.create({
      data: {
        userId,
        name: body.eventName,
        type: body.eventType || "exam",
        date: new Date(body.eventDate),
      },
    });
  }

  // Transition to observation phase
  await prisma.activePhase.upsert({
    where: { userId },
    update: {
      phase: "observation",
      phaseStart: new Date(),
      dayCount: 0,
    },
    create: {
      userId,
      phase: "observation",
      phaseStart: new Date(),
      dayCount: 0,
    },
  });

  return NextResponse.json({ success: true });
}
