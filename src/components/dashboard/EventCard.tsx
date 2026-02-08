"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface EventCardProps {
  events: {
    id: string;
    name: string;
    type: string;
    date: string;
    daysUntil: number;
  }[];
}

export function EventCard({ events }: EventCardProps) {
  return (
    <Card className="bg-[#1a1a26] border-[#2a2a3a]">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming events</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-[#0d0d14] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays size={16} className="text-[#fbbf24]" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">
                      {event.name}
                    </p>
                    <p className="text-gray-500 text-xs capitalize">
                      {event.type}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-mono ${
                    event.daysUntil <= 3
                      ? "text-red-400"
                      : event.daysUntil <= 7
                        ? "text-[#fbbf24]"
                        : "text-gray-400"
                  }`}
                >
                  {event.daysUntil}d
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
