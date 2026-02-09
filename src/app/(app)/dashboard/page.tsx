import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { PhaseBanner } from "@/components/dashboard/PhaseBanner";
import { ActiveSkillCard } from "@/components/dashboard/ActiveSkillCard";
import { CheckInWidget } from "@/components/dashboard/CheckInWidget";
import { EventCard } from "@/components/dashboard/EventCard";
import { WeeklyTrendChart } from "@/components/dashboard/WeeklyTrendChart";
import { SkillRadarChart } from "@/components/dashboard/SkillRadarChart";

export default async function DashboardPage() {
  const session = await requireAuth();
  const userId = session.user.id;

  // Check if onboarding is complete
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });
  if (!profile?.onboardingComplete) {
    redirect("/onboarding");
  }

  const [activePhase, skillProgresses, recentCheckIns, upcomingEvents] =
    await Promise.all([
      prisma.activePhase.findUnique({ where: { userId } }),
      prisma.skillProgress.findMany({
        where: { userId },
        include: { skill: true },
      }),
      prisma.checkIn.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 14,
      }),
      prisma.event.findMany({
        where: { userId, status: "upcoming" },
        orderBy: { date: "asc" },
        take: 3,
      }),
    ]);

  const phase = activePhase?.phase || "onboarding";
  const dayCount = activePhase
    ? Math.ceil(
        (Date.now() - activePhase.phaseStart.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const activeSkillProgress = skillProgresses.find(
    (sp) => sp.status === "active"
  );

  const today = new Date().toISOString().split("T")[0];
  const todayCheckIn = recentCheckIns.find(
    (ci) => ci.date.toISOString().split("T")[0] === today
  );

  const formattedCheckIns = recentCheckIns
    .map((ci) => ({
      date: ci.date.toISOString().split("T")[0],
      initiated: ci.initiated,
      focusLevel: ci.focusLevel,
    }))
    .reverse();

  const trendCheckIns = recentCheckIns.map((ci) => ({
    date: ci.date.toISOString().split("T")[0],
    initiated: ci.initiated,
    focusLevel: ci.focusLevel,
  }));

  const formattedEvents = upcomingEvents.map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    date: e.date.toISOString().split("T")[0],
    daysUntil: Math.ceil(
      (e.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
  }));

  const radarSkills = skillProgresses
    .sort((a, b) => a.skill.tier - b.skill.tier)
    .map((sp) => ({
      name: sp.skill.name,
      status: sp.status,
      stabilityScore: sp.stabilityScore,
    }));

  return (
    <div className="max-w-6xl mx-auto">
      <PhaseBanner
        phase={phase}
        dayCount={dayCount}
        activeSkillName={activeSkillProgress?.skill.name}
        weekPhase={activeSkillProgress?.weekPhase}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeSkillProgress ? (
          <ActiveSkillCard
            skillName={activeSkillProgress.skill.name}
            skillDescription={activeSkillProgress.skill.description}
            weekPhase={activeSkillProgress.weekPhase}
            userTask={activeSkillProgress.userTask}
            stabilityScore={activeSkillProgress.stabilityScore}
          />
        ) : (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-foreground text-lg font-semibold mb-2">
              {phase === "observation"
                ? "Observation in Progress"
                : "No Active Skill"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {phase === "observation"
                ? "Complete your daily check-ins. After 5+ check-ins in 7 days, you'll unlock your first skill."
                : "Visit the Skills page to activate a skill."}
            </p>
          </div>
        )}

        <CheckInWidget
          todayCompleted={!!todayCheckIn}
          recentCheckIns={formattedCheckIns}
        />

        <EventCard events={formattedEvents} />
      </div>

      {/* Skill Radar Chart */}
      {radarSkills.length > 0 && (
        <div className="mt-6">
          <SkillRadarChart skills={radarSkills} />
        </div>
      )}

      {/* Weekly trend chart */}
      <div className="mt-6">
        <WeeklyTrendChart checkIns={trendCheckIns} />
      </div>

      {/* Skill overview */}
      <div className="mt-6">
        <h2 className="text-foreground text-lg font-semibold mb-4">
          Skill Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {skillProgresses
            .sort((a, b) => a.skill.tier - b.skill.tier)
            .map((sp) => {
              const statusColors: Record<string, string> = {
                locked: "border-muted-foreground/30 text-muted-foreground/60",
                available: "border-border text-muted-foreground",
                active: "border-[#38bdf8] text-[#38bdf8]",
                stable: "border-[#4ade80] text-[#4ade80]",
                mastered: "border-[#fbbf24] text-[#fbbf24]",
              };
              const colors = statusColors[sp.status] || statusColors.locked;
              return (
                <div
                  key={sp.id}
                  className={`border rounded-lg p-3 bg-card ${colors}`}
                >
                  <p className="text-xs opacity-60 mb-1">
                    Tier {sp.skill.tier}
                  </p>
                  <p className="text-sm font-medium">{sp.skill.name}</p>
                  <p className="text-xs capitalize mt-1 opacity-60">
                    {sp.status}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
