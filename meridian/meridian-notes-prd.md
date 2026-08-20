# Meridian Notes — Product Requirements Document

**Status:** V1 prototype (clickable, single-file React, all data hardcoded)
**Source of truth:** `src/AdvisorNotesPrototype.jsx`
**Author:** PM draft, grounded in shipped prototype code. Everything below describes what the prototype actually renders. Where behavior is simulated rather than real, it is labeled as an assumption about intended production behavior.

---

## 1. TL;DR

Meridian Notes is a meeting workflow tool for financial advisors that records a client meeting, generates an AI summary with per-claim confidence flags, converts it into calendared action items, and sends the client a plain-language version they must read, confirm point by point, and sign. It is built for solo or small-firm advisors (the prototype persona is a CFP running six meetings a day) whose post-meeting notes are slow to produce, error-prone, and never verified by the client. The tagline in the app header states the bet: "Meeting notes that clients actually confirm."

## 2. Problem

**User pain.** After each meeting an advisor must reconstruct what was said, extract the numbers that matter (dollar amounts, percentages, dates), turn commitments into tasks, and send the client a recap. Doing this manually across six meetings a day is slow, and the numbers are exactly where transcription or memory errors happen. The prototype encodes this fear directly: one flagged summary bullet warns "a transcription error here damages trust."

**Business cost.** Two costs are encoded in the product's design:

1. **Compliance exposure.** Advice given verbally with no written, client-acknowledged record is a liability. The client-view flow ends with a typed signature and the copy "Signed acknowledgment stored to the client file (compliance audit trail)."
2. **Trust erosion.** A recap containing a wrong figure ($3.1M vs. something else) undermines the relationship. The product's accuracy gate exists specifically to prevent unverified AI output from reaching the client.

*Assumption:* the code contains no market sizing, time-savings measurements, or user research. Any quantified claim about the problem (e.g., minutes spent per recap) would need primary research and is deliberately absent here.

## 3. Target user

**Primary persona (as encoded in the prototype):** Sarah Lindqvist, CFP®, principal at "Lindqvist Wealth Advisory." Book of high-net-worth clients ($1.1M–$5.1M AUM each), six meetings on the demo day covering quarterly reviews, estate planning, onboarding, tax-loss harvesting, retirement income, and equity comp.

**Job to be done:** "After a client meeting, get an accurate, client-confirmed written record and a set of scheduled follow-up tasks, without spending my evening writing it."

**Secondary user:** the client (persona: Michael Chen). Their job: understand what was agreed, dispute anything wrong, and know what happens next.

**Current workaround (assumption):** handwritten or CRM notes typed after the meeting, a manually composed recap email, and tasks entered by hand into a calendar or CRM. The prototype implies this by replacing each of those steps. The code shows one concrete trace of the old world: a CRM note dated Jun 12 used as fallback data.

## 4. Goals / Non-goals

**Goals (all present in the prototype flow):**

- Prep the advisor before each meeting: last-meeting topics, live portfolio snapshot, and one personal conversation hook per client.
- Record and live-transcribe the meeting with in-meeting verification aids (numbers auto-highlighted).
- Generate a summary where every AI claim is tagged by confidence, and block sending until low-confidence claims are human-verified.
- Convert the summary into editable, calendared action items with reminders.
- Deliver a client-facing version in plain language, gated by a PIN, requiring per-point confirmation and a signature.
- Route client disputes and questions back to the advisor.
- Support multilingual client copies (English, Chinese, Spanish appear in the language picker).

**Non-goals for V1 (absent from the code):**

- Portfolio management or trade execution. Charts are read-only; the NVDA sell-down is a task, not an order.
- CRM replacement. The product reads from a CRM (fallback note) but does not claim to store client records beyond meeting artifacts.
- Multi-advisor firms: no roles, permissions, or team features exist.
- Client-initiated scheduling: the next meeting is fixed and pushed to the client.
- Real authentication, storage, or backend of any kind (prototype limitation, but also a scoping statement: V1 validates the workflow, not the infrastructure).

## 5. Success metrics

The prototype has no analytics instrumentation. The metrics below are proposed, with the instrumentation each would require.

**North star: client confirmation rate** — percent of sent summaries the client opens, checks every point, and signs within 7 days. This is the behavior the entire client screen is built to produce (all-items-checked plus signature gates the send button). Instrument: events on unlock, per-checkbox toggle, signature entry, and confirm.

**Supporting:**

1. **Flag resolution integrity** — percent of low-confidence bullets that advisors actually edit or expand ("What was said") before marking verified, versus click-through verification. Detects whether the accuracy gate is real or theater. Instrument: compare time-to-verify and edit events against verify events.
2. **Dispute rate** — percent of client-received points removed via "This isn't right — send back." A nonzero-but-low rate is healthy (clients are reading); a rising rate means summary quality is slipping. Instrument: count of returned items per summary.
3. **Action item completion** — percent of generated action items completed by their due date. Requires a completion state that V1 does not yet have (items can be edited and deleted but not checked off). Instrument: add a done state and log transitions.

## 6. Solution overview

**The flow in prose.** The advisor starts the day on a Today screen showing the schedule, a hero card for the next meeting with prep context, and a week-view board of action items across all clients. They start the meeting, which opens a recording screen with a live transcript; numbers are highlighted as they appear so the advisor can verify figures in the moment. Stopping the recording generates an AI summary: key points tagged by investment category and confidence, plus two client-ready charts. Low-confidence points are rendered in red and must each be marked verified before the advisor can proceed; this is the accuracy gate. Approving generates action items with due dates and reminders. Finally the advisor previews exactly what the client will receive, chooses which charts to share, and sends. The client opens a PIN-gated page, confirms each point with a checkbox, can dispute points or ask questions (both route back to the advisor), signs by typing their name, and confirms. Navigation is a five-step wizard; steps unlock only after being reached once, so the advisor cannot jump ahead but can go back.

**Screen 1 — Today (`HomeScreen`).**
Schedule of six meetings; hero card for the next one with three "top of mind last meeting" bullets, a "personal hook" panel, an AI-linked portfolio donut (current vs. target per holding), and a five-day action item board covering all clients with inline add/edit/delete.
*Design decision:* prep is pushed to the advisor rather than searched for; the hook panel explicitly never renders empty — when social lookup fails it falls back to the last CRM personal note with a visible warning banner. *Assumption:* production would source hooks from public social posts and CRM notes only, as the in-app caption states ("Use once, naturally. Sourced from public posts or your own CRM notes only.").

**Screen 2 — Record (`RecordScreen`).**
Timer, start/pause/resume/stop, live transcript that auto-scrolls, dollar amounts / percentages / key ages highlighted with an advisor-selectable highlight color (purple, blue, amber). Pause is labeled "off-record sidebar (not transcribed)." Header states recording is disclosed, consented per firm policy, and encrypted at rest.
*Design decision:* pause is a compliance feature, not just a convenience — it lets advisor and client go off the record. *Assumption:* the transcript is hardcoded and plays back on a timer; production requires real speech-to-text. The consent and encryption claims in the header are copy only; nothing in the code enforces them.

**Screen 3 — Summary (`SummaryScreen`).**
A ~1.4s simulated generation state, then: key points (each with investment-category color tag, confidence level, expandable "What was said" context, edit/remove, manual add), suggested reading with attach checkboxes, an allocation chart (current vs. target, direct-labeled), and an adjustable retirement projection (goal and monthly-contribution sliders recompute the goal-crossing age live). Sections can be hidden. The "Approve & generate action items" button is disabled until every low-confidence point is marked verified.
*Design decision:* the accuracy gate is the core mechanic — the AI states its own uncertainty (e.g., "target allocation inferred from plan documents, not stated verbatim") and the UI refuses to proceed until a human resolves it. *Assumptions:* summary bullets, confidence levels, and reading recommendations are hardcoded; the projection is a simple fixed-rate compounding function (5.2% annual on principal, a small contribution term), not a Monte Carlo, despite the copy referencing one. Production math must be defensible.

**Screen 4 — Action items (`ActionsScreen`).**
Editable task list scoped to the meeting's client: inline text edit, due-date picker limited to the current week, per-item reminder toggle ("Reminder on · 9 AM day-of"), add and delete. Footer copy claims two-way Apple/Google calendar sync.
*Design decision:* action items are first-class objects shared with the Today screen's week board (same state), so a task edited in either place is one task. *Assumption:* calendar sync is copy only; no integration exists in code.

**Screen 5 — Client view (`ClientScreen`).**
The advisor previews as the client. Advisor controls choose which charts the client sees. The client experience: PIN unlock (4-digit code; error state and a "Text me my code" recovery affordance), a plain-language rewrite of the summary (first person, no jargon — compare "Trim NVDA concentration 18% → 10%" with "Sarah will begin a scheduled reduction of my NVIDIA stock…"), per-point confirm checkboxes, a dispute button per point ("This isn't right — remove & send back to Sarah") with undo, a free-text question box, shared charts, reading picks, next-meeting card with a real .ics download and Google Calendar link, and a typed-signature field. Confirm is disabled until every remaining point is checked and the signature has 3+ characters. After sending: confirmation screen showing the audit-trail message, any disputed points and questions routed back to the advisor, and a return path to the day's next meeting.
*Design decisions:* confirmation is per-point, not a single "I agree," forcing actual reading; disputes are a first-class path rather than a failure state. *Assumptions:* the PIN (0412) and its on-screen hint are demo scaffolding — production needs real auth and must not display the code. The client's copy is hardcoded; production needs a reliable plain-language rewrite of the approved bullets. The "auto thank-you" message on the sent screen is fabricated demo content and should not ship as-is.

## 7. Requirements

| Priority | Requirement | Grounding & rationale |
|---|---|---|
| P0 | Live recording with transcript, pause (off-record), stop | Core input to everything downstream; pause-as-off-record is a compliance need (`RecordScreen`) |
| P0 | AI summary with per-claim confidence and "what was said" provenance | The product's differentiator; provenance is what lets an advisor verify quickly (`SUMMARY_BULLETS.detail`) |
| P0 | Accuracy gate: block progression until all low-confidence claims are human-verified | Prevents unreviewed AI output reaching a client; enforced by disabled button in `SummaryScreen` |
| P0 | Advisor edit/remove/add on every summary bullet and action item | Human stays the author of record; manual adds are labeled "not extracted from the transcript" |
| P0 | Client confirmation flow: PIN access, per-point checkboxes, typed signature, all gated before send | The compliance artifact and the north-star behavior (`ClientScreen`) |
| P0 | Client dispute path with undo, routed back to advisor | Errors surfaced by the client must have somewhere to go; shown on the sent screen |
| P1 | Pre-meeting prep card: last-meeting topics, portfolio snapshot, personal hook with CRM fallback | Drives daily-open habit; fallback rule "never leave this box empty" is explicit in code |
| P1 | Action items with due dates, reminders, and cross-client week board | Turns the summary into scheduled work; shared state between screens already built |
| P1 | Advisor controls over which charts the client sees | Not all clients should see all visuals; toggles exist in `ClientScreen` |
| P1 | Client question box delivered with the confirmation | Keeps the summary a conversation, not a receipt |
| P1 | Next-meeting card with .ics download and Google Calendar link | Only real integration in the prototype; cheap retention win |
| P2 | Multilingual client copy (Chinese, Spanish) generated at send time | Real need (trust documents for family members) but picker is UI-only today |
| P2 | Suggested reading with per-item attach | Nice relationship touch; static list in V1 |
| P2 | Adjustable retirement projection sliders (live goal-crossing age) | Powerful in-meeting tool, but math must be validated before client exposure |
| P2 | Transcript highlight color preference | Small personalization; already built |

## 8. Edge cases & states

States the prototype explicitly handles:

- **Social lookup unavailable:** amber warning plus CRM-note fallback; the hook box never renders empty.
- **Portfolio not linked:** "Awaiting custodian feed" badge on the schedule (Priya Raghavan row).
- **All summary bullets deleted:** empty state warns "Nothing will be sent — re-generate from the transcript."
- **All action items deleted:** empty state with prompt to add.
- **Client removes every point:** empty state tells the client the advisor will revise and resend.
- **Wrong PIN:** error styling, retry, "Text me my code" recovery.
- **Goal unreachable by 65 in projection:** chart caption switches to "adjust contribution or goal."
- **Unconfirmed or unsigned client view:** send disabled with explanatory caption.
- **Low-confidence claims:** red styling, per-item verify, count badge ("2 of 2 flags need review").

Not handled, must be specified for production:

- **Offline / recording failure mid-meeting.** No handling exists. Losing a meeting's audio is the worst failure mode; needs local buffering and recovery.
- **Transcription confidence below usable threshold** (accents, crosstalk, bad audio). The confidence system covers claims, not the transcript itself.
- **Client never opens or never signs.** No reminder or expiry logic.
- **PIN lockout / brute force.** Unlimited attempts in V1.
- **Summary generation failure.** Only a success path with a fixed 1.4s delay exists.

## 9. Trade-offs

- **Wizard with gated steps, not free navigation.** Steps unlock only once reached (`unlocked` array). Chose enforced sequence over flexibility because the compliance value depends on the gate order: no client send without summary review. Cost: an advisor who only wants to jot a quick task must still walk the flow.
- **Blocking accuracy gate over advisory warnings.** A softer design would warn but allow send. Chose hard blocking because one wrong number to a client outweighs the friction of two extra clicks. Cost: advisors may rubber-stamp; metric 5.1 watches for this.
- **Per-point client confirmation over one signature.** More client effort, but a single "I agree" produces the same unread-terms behavior the product exists to fix.
- **Plain-language rewrite for the client instead of the advisor's bullets verbatim.** Two versions of the truth is a risk (they can drift), but jargon-free first-person copy is what makes confirmation meaningful. Mitigation in production: generate the client copy from the approved bullets, never independently.
- **PIN gate over full account login for clients.** Low-friction access for a possibly elderly or non-technical client base, at the cost of weaker auth. Production needs at minimum rate limiting and a real code-delivery channel.
- **Personal hook feature at all.** Surfacing a client's social posts to their advisor is useful and slightly uncomfortable. The code hedges with sourcing rules and "use once, naturally" guidance; whether that is enough is an open question (see 10).

## 10. Risks & open questions

**Technical**

- Real-time transcription accuracy on financial vocabulary and numbers is the whole ballgame; the prototype fakes it. What word-error rate on dollar figures is acceptable?
- Claim-level confidence scoring (the red flags) is the hardest ML problem here and is entirely simulated. If confidence is poorly calibrated, the gate is either noise (too many flags) or false comfort (too few).
- The projection math is a toy compounding loop while the copy references Monte Carlo runs. Shipping client-visible projections requires validated financial modeling and likely disclosures.
- Claimed integrations that do not exist yet: custodian portfolio feeds, CRM, two-way calendar sync, SMS code delivery, translation.

**Adoption**

- Will clients consent to recording? The flow assumes disclosed consent per firm policy but has no consent-capture step.
- Will advisors trust the gate or resent it? Rubber-stamp verification would hollow out the product.
- Does per-point confirmation feel protective to clients or like homework?

**Compliance / privacy**

- Recording financial-advice conversations implicates state recording-consent laws and SEC/FINRA books-and-records rules. The audit-trail claim ("stored to the client file") must be backed by retention infrastructure.
- The demo PIN hint is a client's daughter's birthday displayed in plaintext. Production auth must be designed from scratch.
- Social-media monitoring of clients needs an explicit policy and possibly client disclosure.
- Multilingual summaries of financial advice raise translation-accuracy liability (the Chinese copy goes to a trust member).

**Open questions**

- Who owns the record when the client disputes a point after signing others?
- Is the client's confirmed summary a legal acknowledgment, and does that require specific language reviewed by counsel?
- Where does the transcript live, for how long, and who can access it?

## 11. Roadmap

**V1 (this prototype validates the workflow):** the five-screen flow with simulated AI — recording UX, accuracy gate, action items, client confirmation with dispute/questions, .ics/GCal export. Unlock: proof that the gate-and-confirm loop is usable end to end before any ML investment.

**V2 (make the AI real):** live speech-to-text, real summary generation with calibrated claim confidence, plain-language client copy generated from approved bullets, real PIN delivery via SMS, summary-open and reminder notifications, action-item completion state. Unlock: the product works on a real meeting, which enables pilot deployments with actual advisors.

**V3 (make it a system):** custodian portfolio feeds (replacing the hardcoded snapshot), CRM read/write, two-way calendar sync, send-time translation, multi-client memory across meetings (the "top of mind last meeting" card generated from prior summaries), firm-level compliance archive and export. Unlock: the daily-habit Today screen becomes real, which is what retains advisors between meetings and supports firm-level sales.

## 12. What we'd validate next

1. **Does the accuracy gate produce real verification?** Method: moderated usability sessions with 5–8 advisors reviewing summaries seeded with one genuine error among the flags. Measure whether they catch it and how long verification takes. *Changes our mind if:* advisors mark-verify without reading. Then the gate needs redesign (e.g., show the transcript excerpt inline and require an explicit match/mismatch choice) before it can be a P0 claim.
2. **Will clients complete per-point confirmation?** Method: pilot the client view with 15–20 real clients of 2–3 friendly advisors; measure open rate, completion rate, time on page, and dispute usage. *Changes our mind if:* completion is low or clients check-all in under 20 seconds. Then per-point confirmation collapses to a summary-level acknowledgment and the north-star metric changes.
3. **Is the personal hook welcome or creepy?** Method: interview advisors and a small client panel on the sourcing rules. *Changes our mind if:* clients react negatively to advisors referencing their posts. Then the feature restricts to CRM-sourced notes only.
4. **Transcription accuracy on numbers.** Method: benchmark 3 STT vendors on recorded mock advisory meetings, scoring dollar-figure and percentage word-error rate specifically. *Changes our mind if:* no vendor gets figures reliably right. Then V2 leads with human-in-the-loop number confirmation during the meeting (the highlight UX becomes tap-to-correct, which the copy already hints at) rather than post-hoc flags.
