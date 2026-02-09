"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ActiveSkillCardProps {
  skillName: string;
  skillDescription: string;
  weekPhase: number;
  userTask?: string | null;
  stabilityScore: number;
}

const weekInfo: Record<number, { label: string; color: string }> = {
  0: { label: "Not Started", color: "text-muted-foreground" },
  1: { label: "Stabilize", color: "text-[#38bdf8]" },
  2: { label: "Express", color: "text-[#fbbf24]" },
  3: { label: "Probe", color: "text-[#4ade80]" },
};

export function ActiveSkillCard({
  skillName,
  skillDescription,
  weekPhase,
  userTask,
  stabilityScore,
}: ActiveSkillCardProps) {
  const week = weekInfo[weekPhase] || weekInfo[0];
  const progressPercent = ((weekPhase) / 3) * 100;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg">{skillName}</CardTitle>
          <Badge variant="outline" className={`border-current ${week.color}`}>
            {week.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{skillDescription}</p>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground/70 mb-1">
            <span>Cycle Progress</span>
            <span>Week {weekPhase}/3</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-secondary" />
        </div>

        {userTask && (
          <div className="bg-surface-inset rounded-lg p-3">
            <p className="text-xs text-muted-foreground/70 mb-1">Your task</p>
            <p className="text-foreground/80 text-sm">{userTask}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/70">Stability Score</span>
          <span className="text-sm text-[#4ade80] font-mono">
            {(stabilityScore * 100).toFixed(0)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
