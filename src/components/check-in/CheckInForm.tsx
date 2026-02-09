"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface CheckInFormProps {
  activeSkillSlug?: string;
}

const focusOptions = [
  { value: "none", label: "None", description: "Didn't really focus" },
  { value: "brief", label: "Brief", description: "A few minutes of focus" },
  { value: "focused", label: "Focused", description: "Solid focused block" },
  { value: "deep", label: "Deep", description: "Extended deep focus" },
];

const decayOptions = [
  { value: "<10m", label: "< 10 min" },
  { value: "10-25m", label: "10-25 min" },
  { value: "25-45m", label: "25-45 min" },
  { value: "45-60m", label: "45-60 min" },
  { value: "no_loss", label: "No loss" },
];

export function CheckInForm({ activeSkillSlug }: CheckInFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [initiated, setInitiated] = useState<boolean | null>(null);
  const [focusLevel, setFocusLevel] = useState<string | null>(null);
  const [decayPoint, setDecayPoint] = useState<string | null>(null);
  const [contextNote, setContextNote] = useState("");
  const [atypical, setAtypical] = useState(false);
  const [energy, setEnergy] = useState<number | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const showDecay = activeSkillSlug === "focus-endurance" && focusLevel && focusLevel !== "none";

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initiated: initiated === true,
          focusLevel,
          decayPoint: showDecay ? decayPoint : null,
          contextNote: contextNote || null,
          atypical,
          energy,
          mood,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit");
        setSubmitting(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Step 1: Did you study? */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <h3 className="text-foreground text-lg mb-4">Did you study today?</h3>
          <div className="flex gap-3">
            {[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ].map((opt) => (
              <Button
                key={String(opt.value)}
                variant="outline"
                onClick={() => {
                  setInitiated(opt.value);
                  setStep(opt.value ? 1 : 3);
                }}
                className={`flex-1 py-6 ${
                  initiated === opt.value
                    ? "border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Focus level */}
      {(step >= 1 && initiated) && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="text-foreground text-lg mb-4">How was your focus?</h3>
            <div className="grid grid-cols-2 gap-3">
              {focusOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant="outline"
                  onClick={() => {
                    setFocusLevel(opt.value);
                    setStep(2);
                  }}
                  className={`py-6 flex flex-col items-center gap-1 h-auto ${
                    focusLevel === opt.value
                      ? "border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-xs opacity-60">{opt.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2.5: Decay point (Focus Endurance only) */}
      {step >= 2 && showDecay && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="text-foreground text-lg mb-4">When did focus drop?</h3>
            <div className="grid grid-cols-3 gap-2">
              {decayOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant="outline"
                  onClick={() => setDecayPoint(opt.value)}
                  className={`py-4 text-sm ${
                    decayPoint === opt.value
                      ? "border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Context & optional fields */}
      {step >= 2 || (step >= 3 && !initiated) ? (
        <Card className="bg-card border-border">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-foreground text-lg mb-2">
                Anything to note? <span className="text-muted-foreground/70 text-sm">(optional)</span>
              </h3>
              <Textarea
                value={contextNote}
                onChange={(e) => setContextNote(e.target.value)}
                placeholder="Quick context about your day..."
                className="bg-surface-inset border-border text-foreground resize-none"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="atypical"
                checked={atypical}
                onCheckedChange={(c) => setAtypical(c === true)}
                className="border-border data-[state=checked]:bg-[#fbbf24] data-[state=checked]:border-[#fbbf24]"
              />
              <label htmlFor="atypical" className="text-muted-foreground text-sm">
                Mark as atypical day (illness, travel, etc.)
              </label>
            </div>

            {/* Energy & Mood bars */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs mb-2">Energy (optional)</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setEnergy(energy === v ? null : v)}
                      className={`flex-1 h-6 rounded ${
                        energy && v <= energy
                          ? "bg-[#38bdf8]"
                          : "bg-secondary"
                      } transition-colors`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-2">Mood (optional)</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setMood(mood === v ? null : v)}
                      className={`flex-1 h-6 rounded ${
                        mood && v <= mood
                          ? "bg-[#4ade80]"
                          : "bg-secondary"
                      } transition-colors`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              onClick={handleSubmit}
              disabled={submitting || initiated === null}
              className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black font-semibold py-6"
            >
              {submitting ? "Submitting..." : "Submit Check-In"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
