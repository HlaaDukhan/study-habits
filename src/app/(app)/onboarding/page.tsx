"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const challenges = [
  "Starting is the hardest part",
  "I get distracted easily",
  "I study but nothing sticks",
  "I can't focus for long",
  "I procrastinate until the last minute",
  "I don't know what to study first",
];

const times = [
  "Early morning",
  "Late morning",
  "Afternoon",
  "Evening",
  "Late night",
  "Varies day to day",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [studyGoal, setStudyGoal] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [typicalHours, setTypicalHours] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("exam");
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studyGoal,
          biggestChallenge,
          preferredTime,
          typicalHours,
          eventName,
          eventDate,
          eventType,
        }),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-lg w-full">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i <= step ? "bg-[#38bdf8]" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">
                What are you working toward?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Your study goal</Label>
                <Input
                  value={studyGoal}
                  onChange={(e) => setStudyGoal(e.target.value)}
                  placeholder="e.g., Pass organic chemistry, improve GPA..."
                  className="bg-surface-inset border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">
                  How many hours do you typically study per day?
                </Label>
                <Input
                  type="number"
                  value={typicalHours}
                  onChange={(e) => setTypicalHours(e.target.value)}
                  placeholder="e.g., 2"
                  min="0"
                  max="16"
                  step="0.5"
                  className="bg-surface-inset border-border text-foreground"
                />
              </div>
              <Button
                onClick={() => setStep(1)}
                className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black font-semibold"
              >
                Next
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">
                What trips you up most?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  onClick={() => {
                    setBiggestChallenge(c);
                    setStep(2);
                  }}
                  className={`w-full text-left justify-start py-4 ${
                    biggestChallenge === c
                      ? "border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {c}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">
                When do you usually study?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {times.map((t) => (
                  <Button
                    key={t}
                    variant="outline"
                    onClick={() => {
                      setPreferredTime(t);
                      setStep(3);
                    }}
                    className={`py-4 ${
                      preferredTime === t
                        ? "border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">
                Upcoming academic event
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Add an exam, quiz, or deadline to anchor your training.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Event name</Label>
                <Input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Midterm Exam"
                  className="bg-surface-inset border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Date</Label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-surface-inset border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["exam", "quiz", "deadline", "project"].map((t) => (
                    <Button
                      key={t}
                      variant="outline"
                      size="sm"
                      onClick={() => setEventType(t)}
                      className={`capitalize ${
                        eventType === t
                          ? "border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleComplete}
                disabled={submitting}
                className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black font-semibold py-6"
              >
                {submitting ? "Setting up..." : "Start Observation Phase"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleComplete}
                disabled={submitting}
                className="w-full text-muted-foreground/70 hover:text-foreground/80"
              >
                Skip event for now
              </Button>
            </CardContent>
          </Card>
        )}

        {step > 0 && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="mt-4 text-muted-foreground/70 hover:text-foreground/80"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
