import { requireAuth } from "@/lib/session";
import { getAvailableSkills } from "@/lib/skills/progression";
import { prisma } from "@/lib/db/prisma";
import { SkillTree } from "@/components/skills/SkillTree";

export default async function SkillsPage() {
  const session = await requireAuth();
  const userId = session.user.id;

  const skills = await getAvailableSkills(userId);
  const activePhase = await prisma.activePhase.findUnique({
    where: { userId },
  });

  const hasActiveSkill = skills.some((s) => s.currentStatus === "active");
  const canActivate =
    activePhase?.phase === "skill_training" && !hasActiveSkill;

  const serialized = skills.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    tier: s.tier,
    description: s.description,
    purpose: s.purpose,
    currentStatus: s.currentStatus,
    prereqsMet: s.prereqsMet,
    prerequisites: s.dependsOn.map((dep) => {
      const prereqSkill = skills.find((sk) => sk.id === dep.prerequisiteId);
      return {
        name: dep.prerequisite.name,
        slug: dep.prerequisite.slug,
        met:
          prereqSkill?.currentStatus === "stable" ||
          prereqSkill?.currentStatus === "mastered",
      };
    }),
    progress: s.progress
      ? {
          weekPhase: s.progress.weekPhase,
          stabilityScore: s.progress.stabilityScore,
          userTask: s.progress.userTask,
        }
      : null,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Skill Tree</h1>
      <p className="text-muted-foreground text-sm mb-4">
        Master skills from the bottom up. Each skill builds on the ones below
        it.
      </p>
      <div className="bg-card border border-border rounded-xl px-4 py-3 mb-8 text-sm text-muted-foreground">
        Skills unlock when their prerequisites reach{" "}
        <span className="text-[#4ade80] font-medium">Stable</span> or better —
        meaning you completed their 3-week training cycle. Progress is based on
        your check-in patterns, not a fixed timer.
      </div>
      <SkillTree skills={serialized} canActivate={canActivate} />
    </div>
  );
}
