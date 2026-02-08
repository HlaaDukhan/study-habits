import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";

const focusColors: Record<string, string> = {
  none: "bg-gray-600",
  brief: "bg-yellow-500",
  focused: "bg-[#38bdf8]",
  deep: "bg-[#4ade80]",
};

export default async function HistoryPage() {
  const session = await requireAuth();

  const checkIns = await prisma.checkIn.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 30,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Check-In History</h1>

      {checkIns.length === 0 ? (
        <p className="text-gray-500">No check-ins yet.</p>
      ) : (
        <div className="space-y-2">
          {checkIns.map((ci) => (
            <div
              key={ci.id}
              className="bg-[#1a1a26] border border-[#2a2a3a] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    ci.initiated
                      ? focusColors[ci.focusLevel || "none"]
                      : "bg-gray-700"
                  }`}
                />
                <div>
                  <p className="text-gray-300 text-sm">
                    {ci.date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {ci.initiated
                      ? `Studied • ${ci.focusLevel || "no focus data"}`
                      : "Did not study"}
                    {ci.atypical && " • Atypical"}
                    {ci.backfilled && " • Backfilled"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {ci.energy && (
                  <span>
                    Energy: {ci.energy}/5
                  </span>
                )}
                {ci.mood && (
                  <span>
                    Mood: {ci.mood}/5
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
