"use client";

import { Badge } from "@/components/ui/badge";

interface PhaseBannerProps {
  phase: string;
  dayCount: number;
  activeSkillName?: string | null;
  weekPhase?: number;
}

const phaseLabels: Record<string, string> = {
  onboarding: "Onboarding",
  observation: "Observation Phase",
  skill_training: "Skill Training",
};

const weekLabels: Record<number, string> = {
  1: "Week 1 — Stabilize",
  2: "Week 2 — Express",
  3: "Week 3 — Probe",
};

export function PhaseBanner({
  phase,
  dayCount,
  activeSkillName,
  weekPhase,
}: PhaseBannerProps) {
  const label = phaseLabels[phase] || phase;

  return (
    <div className="w-full rounded-xl bg-gradient-to-r from-[#38bdf8]/10 to-[#4ade80]/10 border border-[#2a2a3a] p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-[#38bdf8] text-[#38bdf8] text-xs"
          >
            {label}
          </Badge>
          {activeSkillName && (
            <span className="text-gray-300 text-sm">
              Active: <span className="text-[#38bdf8]">{activeSkillName}</span>
            </span>
          )}
          {weekPhase && weekPhase > 0 && (
            <Badge
              variant="outline"
              className="border-[#4ade80] text-[#4ade80] text-xs"
            >
              {weekLabels[weekPhase]}
            </Badge>
          )}
        </div>
        <span className="text-gray-500 text-sm">Day {dayCount}</span>
      </div>
    </div>
  );
}
