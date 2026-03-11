"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SkillNode {
  id: string;
  slug: string;
  name: string;
  tier: number;
  description: string;
  purpose: string;
  currentStatus: string;
  prereqsMet: boolean;
  prerequisites: { name: string; slug: string; met: boolean }[];
  progress?: {
    weekPhase: number;
    stabilityScore: number;
    userTask: string | null;
  } | null;
}

interface SkillTreeProps {
  skills: SkillNode[];
  canActivate: boolean;
}

const statusStyles: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  locked: {
    border: "border-muted-foreground/30",
    bg: "bg-card",
    text: "text-muted-foreground/60",
    glow: "",
  },
  available: {
    border: "border-border",
    bg: "bg-card",
    text: "text-muted-foreground",
    glow: "",
  },
  active: {
    border: "border-[#38bdf8]",
    bg: "bg-[#38bdf8]/5",
    text: "text-[#38bdf8]",
    glow: "shadow-[0_0_15px_rgba(56,189,248,0.15)]",
  },
  stable: {
    border: "border-[#4ade80]",
    bg: "bg-[#4ade80]/5",
    text: "text-[#4ade80]",
    glow: "",
  },
  mastered: {
    border: "border-[#fbbf24]",
    bg: "bg-[#fbbf24]/5",
    text: "text-[#fbbf24]",
    glow: "shadow-[0_0_15px_rgba(251,191,36,0.15)]",
  },
};

export function SkillTree({ skills, canActivate }: SkillTreeProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<SkillNode | null>(null);
  const [userTask, setUserTask] = useState("");
  const [loading, setLoading] = useState(false);

  const tiers = [1, 2, 3, 4];

  const handleActivate = async (skillId: string) => {
    setLoading(true);
    try {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, action: "activate" }),
      });
      router.refresh();
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSetTask = async (skillId: string) => {
    if (!userTask.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, action: "setTask", userTask }),
      });
      router.refresh();
      setSelected(null);
      setUserTask("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {tiers.map((tier) => {
          const tierSkills = skills.filter((s) => s.tier === tier);
          return (
            <div key={tier}>
              <h3 className="text-muted-foreground/70 text-xs font-medium uppercase tracking-wider mb-3">
                Tier {tier}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tierSkills.map((skill) => {
                  const style = statusStyles[skill.currentStatus] || statusStyles.locked;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelected(skill)}
                      className={`flex-1 border-2 rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${style.border} ${style.bg} ${style.glow}`}
                    >
                      <p className={`font-medium text-sm ${style.text}`}>
                        {skill.name}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1 capitalize">
                        {skill.currentStatus}
                      </p>
                    </button>
                  );
                })}
              </div>
              {tier < 4 && (
                <div className="flex justify-center my-2">
                  <div className="w-px h-6 bg-border" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Skill detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {selected.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">{selected.description}</p>
                <div className="bg-surface-inset rounded-lg p-3">
                  <p className="text-xs text-muted-foreground/70 mb-1">Why this skill?</p>
                  <p className="text-foreground/80 text-sm">{selected.purpose}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground/70">Status</span>
                  <span className="capitalize text-foreground/80">
                    {selected.currentStatus}
                  </span>
                </div>

                {selected.progress && selected.currentStatus === "active" && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground/70">Week</span>
                      <span className="text-foreground/80">
                        {selected.progress.weekPhase}/3
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground/70">Stability</span>
                      <span className="text-[#4ade80]">
                        {(selected.progress.stabilityScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    {selected.progress.userTask && (
                      <div className="bg-surface-inset rounded-lg p-3">
                        <p className="text-xs text-muted-foreground/70 mb-1">Your task</p>
                        <p className="text-foreground/80 text-sm">
                          {selected.progress.userTask}
                        </p>
                      </div>
                    )}
                    {!selected.progress.userTask && (
                      <div className="space-y-2">
                        <Label className="text-foreground/80 text-sm">
                          Define your task (time/place/action)
                        </Label>
                        <Input
                          value={userTask}
                          onChange={(e) => setUserTask(e.target.value)}
                          placeholder="e.g., At 8am at my desk, I will open my textbook"
                          className="bg-surface-inset border-border text-foreground"
                        />
                        <Button
                          onClick={() => handleSetTask(selected.id)}
                          disabled={loading || !userTask.trim()}
                          className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black"
                        >
                          {loading ? "Saving..." : "Set Task"}
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {selected.currentStatus === "available" && canActivate && (
                  <Button
                    onClick={() => handleActivate(selected.id)}
                    disabled={loading}
                    className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black font-semibold"
                  >
                    {loading ? "Activating..." : "Activate This Skill"}
                  </Button>
                )}

                {selected.currentStatus === "locked" && (
                  <div className="space-y-3">
                    {selected.prerequisites.length > 0 && (
                      <div className="bg-surface-inset rounded-lg p-3 space-y-2">
                        <p className="text-xs text-muted-foreground/70 font-medium">
                          Required to unlock
                        </p>
                        {selected.prerequisites.map((p) => (
                          <div key={p.slug} className="flex items-center gap-2 text-sm">
                            <span className={p.met ? "text-[#4ade80]" : "text-muted-foreground/50"}>
                              {p.met ? "✓" : "○"}
                            </span>
                            <span className={p.met ? "text-foreground/80 line-through" : "text-muted-foreground/70"}>
                              {p.name}
                            </span>
                            {p.met && (
                              <span className="text-[#4ade80] text-xs">Stable</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-muted-foreground/60 text-xs text-center">
                      Prerequisites must reach Stable (3-week cycle complete) to unlock this skill.
                    </p>
                  </div>
                )}

                <Link
                  href={`/skills/${selected.slug}`}
                  className="block text-center text-muted-foreground hover:text-[#38bdf8] text-sm mt-2 transition-colors"
                >
                  View full details
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
