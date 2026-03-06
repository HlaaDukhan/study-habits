# AI-Guided Study Habit Refinement System
## Core Plan & Logic Specification

---

## 1. Purpose

This system is designed to help students improve the efficiency and reliability of their studying by refining a single core habit through skill-based progression.

The system does NOT:
- Prescribe habits
- Add multiple habits
- Perform deep psychological analysis

The system DOES:
- Diagnose study-related skills
- Guide the user toward the next skill to sharpen
- Allow the user to define their own tasks
- Adapt plans based on real behavior and context

---

## 2. Core Principle

One habit. Multiple skill upgrades.

The user maintains one consistent study habit:
> “I show up to study.”

The quality, effectiveness, and stability of this habit are improved by training one skill at a time.

---

## 3. Roles & Responsibilities

### 3.1 AI Responsibilities

The AI:
- Identifies the user’s strengthened skills
- Identifies the single most limiting skill to train next
- Explains why that skill matters
- Helps reduce ambiguity and friction
- Interprets behavior with context
- Adjusts analysis when the user provides explanations

The AI does NOT:
- Decide the habit
- Decide the task details
- Force escalation
- Judge or moralize performance

---

### 3.2 User Responsibilities

The user:
- Chooses the concrete habit details (time, place, task)
- Reports daily behavior (quick check-ins)
- Provides context when behavior is atypical
- Confirms or challenges the AI’s interpretation
- Chooses whether to accept AI suggestions

---

## 4. Entry Conditions

### 4.1 Domain Selection
The system currently supports:
- Studying (students)

Future domains may be added later.

---

### 4.2 Anchor Event Selection
The user must select a next important academic event:
- Exam
- Quiz
- Assignment deadline

Rules:
- Event must be at least 5–7 days away
- If the event is too close, the user must select a later one
- The event defines the observation and training timeline

---

## 5. Self-Assessment Calibration (Pre-Observation)

Before tracking begins, the user answers a short self-assessment:
- Which study skills do you think you struggle with most?
- Which skills do you think you are already good at?
- Any known issues with motivation or subject dislike?

Purpose:
- Capture self-perception
- Later compare perception vs observed behavior
- Improve insight and trust

---

## 6. Observation Phase

### Duration
- Approximately 7 days
- Flexible if behavior is inconsistent

### Purpose
- Observe real study behavior
- Validate or challenge self-assessment
- Identify dominant friction patterns

### Rules
- No skills are trained yet
- No habit changes required
- Context explanations are allowed and encouraged

---

## 7. Skill Tree (Studying)

### Tier 1 — Entry Skills
1. Task Clarity  
2. Initiation  

### Tier 2 — Stability Skills
3. Focus Containment  
4. Environment Control  

### Tier 3 — Capacity Skills
5. Focus Endurance  
6. Cognitive Recovery  

### Tier 4 — Strategic Skills
7. Planning & Sequencing  
8. Deadline Calibration  

Rules:
- Only one skill is active at a time
- Skills are unlocked sequentially based on dependency
- Skills are never permanently “lost”

---

## 8. Skill Deployment Cycle

Each skill is trained over 3 weeks.

### Week 1 — Stabilization
- Skill lens is introduced
- Habit remains easy
- Data is considered noisy
- AI intervention is minimal

### Week 2 — Skill Expression
- Skill performance stabilizes
- Trends are evaluated
- Optional micro-adjustments allowed

### Week 3 — Performance Probing
- No new skill introduced
- AI measures limits related to the *next* skill
- Data collected to determine next unlock

---

## 9. User-Defined Habit Tasks

When a skill is active:
- The user defines the task that expresses the skill
- The task must include:
  - Time
  - Place
  - Minimum viable action

Example:
- Skill: Focus Endurance
- User task:
  - Time: 7:00 a.m.
  - Place: Desk
  - Constraint: Focus for 1 hour without distractions

AI assistance:
- Clarifies ambiguity
- Suggests friction reduction
- Warns if unrealistic

- Never overrides user choice

---

## 10. Daily Check-In Logic

### Design Goals
- Takes less than 2 minutes
- Allows skipped days
- Allows backfilling (2–3 days)

### Core Inputs
- Initiation (started or not)
- Focus presence
- Optional context explanation
- Optional voice note

---

## 11. Measuring Focus Endurance

During Focus Endurance training, the user is asked:

> “When did you start losing focus?”

Selectable options:
- Less than 10 minutes
- 10–25 minutes
- 25–45 minutes
- 45–60 minutes
- Did not notice focus loss

Rules:
- Question only appears if initiation occurred
- Measures decay point, not total time

---

## 12. Phone Usage Data (Optional)

Phone usage data may be shared only with user consent.

Purpose:
- Suggest low-interruption time windows
- Identify high-friction periods

Rules:
- Never used as a judgment metric
- Never overrides self-report
- Only used when the user requests scheduling help

---

## 13. Context Overrides

Users may explicitly state:
- The week was atypical
- External events interfered
- The behavior does not reflect usual patterns

The AI must:
- Flag the data as contextually noisy
- Adjust confidence, not downgrade skill
- Preserve user trust

---

## 14. Skill Progression Rules

- Progression is based on trend, not perfection
- Skills stabilize before new ones unlock
- Identity labels evolve but do not regress
- Only one active skill at any time

---

## 15. Continuous AI Chat

The AI remains available at all stages to:
- Understand emotional resistance
- Handle subject-specific dislike
- Clarify misunderstandings
- Adjust interpretation

The AI must treat:
- Motivation issues
- Subject aversion
- Temporary overload

As data, not failure.

---

## 16. Outcome

The system produces:
- A stable study habit
- Incremental skill mastery
- Improved efficiency without burnout
- A sense of ownership and competence

---

End of system specification.