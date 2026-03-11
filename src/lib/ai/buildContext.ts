import { prisma } from "@/lib/db/prisma";

export async function buildUserContext(userId: string): Promise<string> {
  const [user, activePhase, recentCheckIns, skillProgresses, upcomingEvents, profile] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
      prisma.activePhase.findUnique({ where: { userId } }),
      prisma.checkIn.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 14,
      }),
      prisma.skillProgress.findMany({
        where: { userId },
        include: { skill: true },
      }),
      prisma.event.findMany({
        where: { userId, status: "upcoming" },
        orderBy: { date: "asc" },
        take: 3,
      }),
      prisma.userProfile.findUnique({ where: { userId } }),
    ]);

  const lines: string[] = [];

  // User info
  if (user?.name) {
    lines.push(`Student name: ${user.name}`);
  }

  // Phase
  if (activePhase) {
    const daysSincePhaseStart = Math.ceil(
      (Date.now() - activePhase.phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    lines.push(`Current phase: ${activePhase.phase} (day ${daysSincePhaseStart})`);
  }

  // Active skill
  const activeSkill = skillProgresses.find((sp) => sp.status === "active");
  if (activeSkill) {
    const weekLabels: Record<number, string> = {
      1: "Stabilize",
      2: "Express",
      3: "Probe",
    };
    lines.push(
      `Active skill: ${activeSkill.skill.name} — Week ${activeSkill.weekPhase} (${weekLabels[activeSkill.weekPhase] || "Not started"})`
    );
    if (activeSkill.userTask) {
      lines.push(`User-defined task: ${activeSkill.userTask}`);
    }
    lines.push(`Stability score: ${activeSkill.stabilityScore}`);
  }

  // All skill levels
  lines.push("\nSkill statuses:");
  for (const sp of skillProgresses) {
    lines.push(`  - ${sp.skill.name} (Tier ${sp.skill.tier}): ${sp.status}`);
  }

  // Recent check-ins
  if (recentCheckIns.length > 0) {
    lines.push(`\nLast ${recentCheckIns.length} check-ins:`);
    for (const ci of recentCheckIns.slice(0, 7)) {
      const dateStr = ci.date.toISOString().split("T")[0];
      let methods: string[] = [];
      try {
        const raw = (ci as { studyMethod?: string | null }).studyMethod;
        if (raw) methods = JSON.parse(raw);
      } catch { /* ignore */ }
      const parts = [
        `date=${dateStr}`,
        `studied=${ci.initiated}`,
        ci.focusLevel ? `focus=${ci.focusLevel}` : null,
        ci.decayPoint ? `decay=${ci.decayPoint}` : null,
        methods.length > 0 ? `methods=${methods.join("+")}` : null,
        ci.atypical ? "ATYPICAL" : null,
        ci.energy ? `energy=${ci.energy}/5` : null,
        ci.mood ? `mood=${ci.mood}/5` : null,
        (ci as { missReason?: string | null }).missReason ? `missed_because=${(ci as { missReason?: string | null }).missReason}` : null,
      ].filter(Boolean);
      lines.push(`  ${parts.join(", ")}`);
    }

    // Summary stats
    const last7 = recentCheckIns.slice(0, 7);
    const initiated = last7.filter((c) => c.initiated).length;
    const focused = last7.filter(
      (c) => c.focusLevel === "focused" || c.focusLevel === "deep"
    ).length;
    lines.push(`\n7-day summary: ${initiated}/7 initiated, ${focused}/7 focused+`);

    // Method → focus correlation
    const methodFocusMap: Record<string, { total: number; focused: number }> = {};
    for (const ci of last7) {
      let methods: string[] = [];
      try {
        const raw = (ci as { studyMethod?: string | null }).studyMethod;
        if (raw) methods = JSON.parse(raw);
      } catch { /* ignore */ }
      for (const m of methods) {
        if (!methodFocusMap[m]) methodFocusMap[m] = { total: 0, focused: 0 };
        methodFocusMap[m].total++;
        if (ci.focusLevel === "focused" || ci.focusLevel === "deep") {
          methodFocusMap[m].focused++;
        }
      }
    }
    const methodEntries = Object.entries(methodFocusMap);
    if (methodEntries.length > 0) {
      const summary = methodEntries
        .map(([m, s]) => `${m}(${s.focused}/${s.total} focused)`)
        .join(", ");
      lines.push(`Study method performance: ${summary}`);
    }
  }

  // Events
  if (upcomingEvents.length > 0) {
    lines.push("\nUpcoming events:");
    for (const event of upcomingEvents) {
      const daysUntil = Math.ceil(
        (event.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      lines.push(`  - ${event.name} (${event.type}) in ${daysUntil} days`);
    }
  }

  // Self-assessment
  if (profile?.selfAssessment) {
    try {
      const sa = JSON.parse(profile.selfAssessment);
      lines.push("\nSelf-assessment:");
      if (sa.studyGoal) lines.push(`  Goal: ${sa.studyGoal}`);
      if (sa.biggestChallenge) {
        try {
          const challenges = JSON.parse(sa.biggestChallenge);
          if (Array.isArray(challenges)) {
            lines.push(`  Biggest challenges: ${challenges.join(", ")}`);
          } else {
            lines.push(`  Biggest challenge: ${sa.biggestChallenge}`);
          }
        } catch {
          lines.push(`  Biggest challenge: ${sa.biggestChallenge}`);
        }
      }
      if (sa.preferredTime) lines.push(`  Preferred study time: ${sa.preferredTime}`);
    } catch {
      // ignore parse errors
    }
  }

  return lines.join("\n");
}
