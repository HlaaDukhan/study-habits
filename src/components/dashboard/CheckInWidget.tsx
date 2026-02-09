"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, X } from "lucide-react";
import Link from "next/link";

interface CheckInWidgetProps {
  todayCompleted: boolean;
  recentCheckIns: {
    date: string;
    initiated: boolean;
    focusLevel: string | null;
  }[];
}

const focusColors: Record<string, string> = {
  none: "bg-gray-600",
  brief: "bg-yellow-500",
  focused: "bg-[#38bdf8]",
  deep: "bg-[#4ade80]",
};

export function CheckInWidget({
  todayCompleted,
  recentCheckIns,
}: CheckInWidgetProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground text-lg">Daily Check-In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayCompleted ? (
          <div className="flex items-center gap-2 text-[#4ade80]">
            <CheckSquare size={18} />
            <span className="text-sm">Completed today</span>
          </div>
        ) : (
          <Link href="/check-in">
            <Button className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black font-semibold">
              Start Check-In
            </Button>
          </Link>
        )}

        <div>
          <p className="text-xs text-muted-foreground/70 mb-2">Last 7 days</p>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const checkIn = recentCheckIns[6 - i];
              if (!checkIn) {
                return (
                  <div
                    key={i}
                    className="w-full h-8 rounded bg-surface-inset flex items-center justify-center"
                  >
                    <X size={10} className="text-muted-foreground/50" />
                  </div>
                );
              }
              const color = checkIn.initiated
                ? focusColors[checkIn.focusLevel || "none"]
                : "bg-gray-700";
              return (
                <div
                  key={i}
                  className={`w-full h-8 rounded ${color} opacity-80`}
                  title={`${checkIn.date}: ${checkIn.focusLevel || "no data"}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
            <span>7d ago</span>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
