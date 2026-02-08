"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Plus, Trash2 } from "lucide-react";

interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  notes: string | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("exam");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = async () => {
    if (!name || !date) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, type }),
    });
    setName("");
    setDate("");
    setShowForm(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/events?id=${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const upcoming = events.filter((e) => e.status === "upcoming");
  const passed = events.filter((e) => e.status === "passed");

  if (loading) {
    return <div className="text-gray-400">Loading events...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black"
        >
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[#1a1a26] border-[#2a2a3a] mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Event name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Final Exam"
                className="bg-[#0d0d14] border-[#2a2a3a] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#0d0d14] border-[#2a2a3a] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Type</Label>
              <div className="flex gap-2">
                {["exam", "quiz", "deadline", "project", "other"].map((t) => (
                  <Button
                    key={t}
                    variant="outline"
                    size="sm"
                    onClick={() => setType(t)}
                    className={`capitalize ${
                      type === t
                        ? "border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10"
                        : "border-[#2a2a3a] text-gray-400"
                    }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                className="bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black"
              >
                Add
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="text-gray-400"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming events */}
      <h2 className="text-white text-lg font-semibold mb-3">Upcoming</h2>
      {upcoming.length === 0 ? (
        <p className="text-gray-500 text-sm mb-6">No upcoming events</p>
      ) : (
        <div className="space-y-2 mb-6">
          {upcoming.map((event) => {
            const daysUntil = Math.ceil(
              (new Date(event.date).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            );
            return (
              <Card
                key={event.id}
                className="bg-[#1a1a26] border-[#2a2a3a]"
              >
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="text-[#fbbf24]" />
                    <div>
                      <p className="text-gray-300 text-sm font-medium">
                        {event.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(event.date).toLocaleDateString()} &middot;{" "}
                        <span className="capitalize">{event.type}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-mono ${
                        daysUntil <= 3
                          ? "text-red-400"
                          : daysUntil <= 7
                            ? "text-[#fbbf24]"
                            : "text-gray-400"
                      }`}
                    >
                      {daysUntil}d
                    </span>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Passed events */}
      {passed.length > 0 && (
        <>
          <h2 className="text-white text-lg font-semibold mb-3">Passed</h2>
          <div className="space-y-2 opacity-60">
            {passed.map((event) => (
              <Card
                key={event.id}
                className="bg-[#1a1a26] border-[#2a2a3a]"
              >
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="text-gray-600" />
                    <div>
                      <p className="text-gray-400 text-sm">{event.name}</p>
                      <p className="text-gray-600 text-xs">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
