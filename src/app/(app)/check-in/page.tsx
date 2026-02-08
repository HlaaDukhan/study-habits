import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";
import { CheckInForm } from "@/components/check-in/CheckInForm";
import { redirect } from "next/navigation";

export default async function CheckInPage() {
  const session = await requireAuth();
  const userId = session.user.id;

  // Check if already checked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await prisma.checkIn.findFirst({
    where: {
      userId,
      date: { gte: today, lt: tomorrow },
    },
  });

  if (existing) {
    redirect("/dashboard");
  }

  const activeSkill = await prisma.skillProgress.findFirst({
    where: { userId, status: "active" },
    include: { skill: true },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Daily Check-In</h1>
      <CheckInForm
        activeSkillSlug={activeSkill?.skill.slug}
      />
    </div>
  );
}
