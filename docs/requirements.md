
# SYSTEM REQUIREMENTS — AI Study Habit Refinement Platform

---

## FUNCTIONAL REQUIREMENTS

### FR-1: Single-Habit Model
- The system must maintain one core study habit.
- All improvements must refine this habit, not add new ones.

### FR-2: Skill-Based Progression
- The system must operate on a predefined study skill tree.
- Only one skill may be active at a time.

### FR-3: Event-Anchored Timeline
- The system must anchor cycles to a user-selected academic event.
- Events must be at least 5–7 days away.

### FR-4: Observation Phase
- The system must support an observation-only phase (~7 days).
- No skills may be trained during this phase.

### FR-5: Three-Week Skill Deployment
- Each skill must follow a 3-week deployment structure.
- The final week must be used to evaluate readiness for the next skill.

### FR-6: User-Defined Tasks
- Users must define their own task details.
- The AI may assist but never override.

### FR-7: Low-Friction Daily Check-Ins
- Daily input must take less than 2 minutes.
- Skipped days and backfilling must be supported.

### FR-8: Context Overrides
- Users must be able to explicitly mark data as atypical.
- The AI must adjust interpretation accordingly.

### FR-9: Focus Endurance Measurement
- The system must measure focus endurance via decay-point questioning.
- The question must only appear when initiation occurs.

### FR-10: Optional Phone Usage Integration
- Phone data must be opt-in.
- Must only be used for scheduling suggestions.

---

## NON-FUNCTIONAL REQUIREMENTS

### NFR-1: Autonomy Preservation
- The system must never remove control from the user.

### NFR-2: Trust Preservation
- The system must avoid shame, punishment, or regression language.

### NFR-3: Interpretability
- The system’s reasoning must be explainable when questioned.

### NFR-4: Adaptability
- The system must handle noisy data and irregular schedules.

### NFR-5: Scalability of Logic
- The logic must be reusable for future domains beyond studying.

---

## OUT OF SCOPE (EXPLICITLY)

- UI design
- Visual gamification
- Technical implementation details
- Mental health diagnosis
- Motivation enforcement

---

END OF REQUIREMENTS

