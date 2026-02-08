import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import {
  checkWeek1Complete,
  checkWeek2Complete,
  checkWeek3Complete,
  advanceWeekPhase,
} from "@/lib/skills/progression";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const activeSkill = await prisma.skillProgress.findFirst({
    where: { userId, status: "active" },
    include: { skill: true },
  });

  if (!activeSkill) {
    return NextResponse.json(
      { error: "No active skill" },
      { status: 400 }
    );
  }

  let result;
  switch (activeSkill.weekPhase) {
    case 1:
      result = await checkWeek1Complete(userId, activeSkill.id);
      break;
    case 2:
      result = await checkWeek2Complete(userId, activeSkill.id);
      break;
    case 3:
      result = await checkWeek3Complete(userId, activeSkill.id);
      break;
    default:
      return NextResponse.json(
        { error: "Invalid week phase" },
        { status: 400 }
      );
  }

  if (result.advanced) {
    const updated = await advanceWeekPhase(userId, activeSkill.id);
    return NextResponse.json({
      advanced: true,
      reason: result.reason,
      skillProgress: updated,
    });
  }

  return NextResponse.json({
    advanced: false,
    reason: result.reason,
  });
}
