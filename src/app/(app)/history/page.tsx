import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";
import { CalendarGrid } from "@/components/history/CalendarGrid";

export default async function HistoryPage() {
  const session = await requireAuth();

  const checkIns = await prisma.checkIn.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 90,
  });

  const serialized = checkIns.map((ci) => ({
    id: ci.id,
    date: ci.date.toISOString().split("T")[0],
    initiated: ci.initiated,
    focusLevel: ci.focusLevel,
    decayPoint: ci.decayPoint,
    contextNote: ci.contextNote,
    atypical: ci.atypical,
    energy: ci.energy,
    mood: ci.mood,
    backfilled: ci.backfilled,
  }));

  // Compute stats
  const last30 = serialized.slice(0, 30);
  const totalCheckIns = last30.length;
  const studiedDays = last30.filter((c) => c.initiated).length;
  const focusedDays = last30.filter(
    (c) => c.focusLevel === "focused" || c.focusLevel === "deep"
  ).length;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Check-In History</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Track your study patterns over time.
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{totalCheckIns}</p>
          <p className="text-muted-foreground/70 text-xs mt-1">Check-ins (30d)</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#38bdf8]">{studiedDays}</p>
          <p className="text-muted-foreground/70 text-xs mt-1">Days studied</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#4ade80]">{focusedDays}</p>
          <p className="text-muted-foreground/70 text-xs mt-1">Focused+ days</p>
        </div>
      </div>

      <CalendarGrid checkIns={serialized} />
    </div>
  );
}
