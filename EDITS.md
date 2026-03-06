# Pending Edits

## UX
- [x] Auto-login after registration and redirect to dashboard

## Auth
- [x] Test password reset flow locally (forgot-password → terminal link → reset)
- [x] Email case sensitivity — normalize to lowercase on register, login, and forgot-password

## Onboarding
- [x] "What trips you up the most" — make it multiple choice + free text "Other" option

## AI & Observation Phase
- [x] During observation phase, prompt the user to chat with the AI — nudge on dashboard with check-in progress and "Talk to coach" button
- [ ] AI should actively surface recurring bad habits noticed from check-in data during observation, not wait for the user to ask

## Plan Visibility
- [x] Plan displayed on dashboard — shows challenges, active skill, week phase description, recovery tip
- [ ] After observation phase ends, AI generates a more detailed written plan
- [ ] Skills page should show how the active skill connects to the identified bad habit — make the "why" obvious

## Missed Days
- [x] When not studying, ask "Why did you miss?" — multiple choice + free text "Other" option
- [ ] AI should factor missed day reasons into its analysis, not just count the absence as a data point

## Motivation & Stories
- [ ] Add a dedicated section (page or sidebar widget) for motivational content: quotes, short stories, and real examples of people overcoming the same habit the user is currently working on
- [ ] Content should be contextual — tied to the active skill/bad habit, not generic motivation
- [ ] Could be AI-generated or curated, refreshed periodically
- [ ] Should feel like a "you're not alone" space, not a lecture

## Email
- [ ] Switch from Resend to Brevo (or similar) to allow sending to any email without a custom domain

## To Investigate
- [ ] (keep testing and add issues here)
