# WISH WELL — Goals, Outcomes and Quarterly Plans
Version: 2026-09-24.1
Source: founder instructions of September 24, 2026, including explicit Mandalart clarification; preserves September 23 three-cycle ERP correction.
Scope: operational meanings of Houses 3, 8 and 9. This correction overrides conflicting older definitions of these objects. Product, department, planet, tool and cadence are separate dimensions; this update does not reassign products or rename repositories.

## The governing rule
A Home holds at least three baseline goal/plan pairs. House 3 defines each SMART Goal. Each Goal has exactly eight Outcome records in House 8. House 9 holds its quarterly Mandalart Plan: one central Goal, eight Outcomes, and eight Task spaces per Outcome (64 task spaces total). Tasks remain canonical House 5 records; the grid references them.

A Goal describes the overall desired change. An Outcome describes an observable condition of success. A Task describes an action. A Plan coordinates the Goal, Outcomes, Tasks, dependencies, resources, dates, Engine and exit decisions. A phase is a stage of work, not an Outcome.

## House ownership
| House | Operational object | Responsibility | Cadence |
|---|---|---|---|
| 3 | Goal | SMART definition, target, baseline, owner, deadline, three ERP cycles and links to eight Outcomes | Cycly |
| 8 | Outcome | Eight measurable success conditions per Goal; evidence, protection, risks, thresholds and exit/transition decisions | Event-triggered assessment |
| 9 | Plan | One primary Goal per quarterly Mandalart grid; sequences its eight Outcomes and up to 64 task spaces | Quarterly |
| 5 | Task | Executable action, owner, due date, dependencies, state and completion evidence | Sprint |

Events remain valid triggers and evidence in House 8; they are no longer its primary operational object. Exit logic belongs to House 8 and is displayed in the House 9 plan. Plans at 6, 9 or 12 months compose linked quarterly plans; do not put multiple central Goals in one grid.

## Mandalart geometry
The central 3×3 block holds the Goal and eight Outcomes. Each surrounding 3×3 block repeats one Outcome at its center and gives it eight task spaces.

| T1.1 | T1.2 | T1.3 | T2.1 | T2.2 | T2.3 | T3.1 | T3.2 | T3.3 |
|---|---|---|---|---|---|---|---|---|
| T1.4 | O1 | T1.5 | T2.4 | O2 | T2.5 | T3.4 | O3 | T3.5 |
| T1.6 | T1.7 | T1.8 | T2.6 | T2.7 | T2.8 | T3.6 | T3.7 | T3.8 |
| T4.1 | T4.2 | T4.3 | O1 | O2 | O3 | T5.1 | T5.2 | T5.3 |
| T4.4 | O4 | T4.5 | O4 | GOAL | O5 | T5.4 | O5 | T5.5 |
| T4.6 | T4.7 | T4.8 | O6 | O7 | O8 | T5.6 | T5.7 | T5.8 |
| T6.1 | T6.2 | T6.3 | T7.1 | T7.2 | T7.3 | T8.1 | T8.2 | T8.3 |
| T6.4 | O6 | T6.5 | T7.4 | O7 | T7.5 | T8.4 | O8 | T8.5 |
| T6.6 | T6.7 | T6.8 | T7.6 | T7.7 | T7.8 | T8.6 | T8.7 | T8.8 |

81 display cells = 1 Goal + 16 Outcome appearances + 64 Task spaces.
There are 73 unique records when all task spaces are populated: 1 Goal + 8 Outcomes + 64 Tasks. Repeated Outcome labels are references to the same records, never duplicates.
64 is planning capacity, not a requirement to invent busywork. Permit empty task spaces during discovery. Larger work can use linked subplans or a successor Goal. The same task may support other Outcomes via relations without being counted twice.

## Minimum three baseline plans
| Plan category | Goal focus | Trust / travel / therapy alignment |
|---|---|---|
| Economic resilience | Define and maintain the household's agreed resource target | Record governance, mobility and care implications |
| Natural-disaster readiness | Define household continuity and readiness conditions | Record governance, mobility and care implications |
| Personal/family disruption — provisional name | Define continuity through relational or household disruption | Record governance, mobility and care implications |

The founder has confirmed three baseline categories; the final name of the third remains open. Trust, travel and therapy are cross-cutting alignment fields on each Plan, not a presumed one-to-one assignment to the three categories.
House 3 shows the three Goals and linked Plans. House 9 owns the actual Plan records. Each Home may hold more Goals; there is no hard maximum of thirteen. Three fully expanded baseline grids provide 24 Outcomes and up to 192 Task spaces, not 192 immediate obligations.

## Eight Beatitudes
The founder requires the eight Outcome slots to align with the eight Beatitudes. Store a Beatitude reference and a reflection prompt separately from each Outcome's measurable target. The exact founder-approved correspondence has not yet been provided. Use slots 1–8 with mapping_status=awaiting_founder_mapping; never present an AI interpretation as the founder's established mapping.
The spiritual lens guides questions and values. Success still requires observable evidence. Do not equate moral worth with productivity, assign virtue scores, or infer that adversity means a person failed spiritually.

## Three-cycle timing
Preserve the September 23 operating rule: three four-week ERP cycles = twelve operating weeks. Each repeats eight stages:
1. New Moon — Manifestation
2. Waxing Crescent — Discovery
3. First Quarter — Planning
4. Waxing Gibbous — Design
5. Full Moon — Intention
6. Waning Gibbous — Inception
7. Last/Third Quarter — Feedback
8. Waning Crescent — Execution

These are WISH WELL's founder-defined stage meanings. They are not conventional astronomical meanings.
Eight phases do not mean eight weeks. Three cycles × eight stages = 24 phase-stage visits, not 24 Outcomes; the same eight Outcomes are developed and assessed across all three cycles.
Keep operating-cycle dates, quarterly review dates and astronomical phase timestamps separate. A lunar cycle is about 29.5 days, so three astronomical cycles are about 88.5 days; twelve operating weeks are 84 days. A calendar quarter is not exactly either duration. Do not force equivalence or invent ephemeris timestamps.
Source for astronomical distinction: https://science.nasa.gov/moon/moon-phases/

## SMART and evidence
AI intake preserves the original Wish and asks only for missing material facts. Proposed numerical targets and deadlines must be marked proposed until the person confirms them.
Goal fields: id, home_id, project_id if relevant, original_wish_id, statement, baseline, target, measurement, owner, starts_at, due_at, three_cycle_ids, consistency_criterion, status, framework_version.
Outcome fields: id, home_id, goal_id, slot 1–8, statement, metric, baseline, target, due_at, owner, beatitude_slot, mapping_status, evidence_links, assessed_at, status, risk_links, protection_links, exit_criterion.
Plan fields: id, home_id, primary_goal_id, category, quarter_start, quarter_end, operating_cycle_ids, grid_task_refs, dependencies, resources, engine_id, trust_alignment, travel_alignment, therapy_alignment, exit_rules, version.
Task fields: id, home_id, primary_outcome_id, supporting_outcome_ids, action, owner, due_at, estimated_effort, dependencies, status, evidence_links.
An outcome is not achieved merely because all its tasks are checked off. Assess its metric and evidence. A Goal completes only when its approved outcome criteria and consistency rule are met, or its scope is explicitly revised with a recorded reason.

## Protection and exit logic
For each Outcome, record what could prevent it, preventive measures, dependencies, evidence, the decision-maker and a condition/action rule.
Separate success criteria from stop conditions. A plan may pause, transition or stop before all eight Outcomes are achieved. Urgent protective action must never be delayed until a grid is complete.
Protection can involve agreements, reserves, backups, support or relevant insurance. Desired outcomes do not themselves establish insurability or coverage; coverage remains unverified until supporting policy evidence is checked.
Represent a decision as: IF the documented condition is met, THEN the named owner takes the specified action, using the linked evidence and review date.

## Notion and app behavior
Use canonical Goals, Outcomes, Plans and Tasks with relations, not independent copies in every House or weekday dashboard.
- House 3: goal portfolio, SMART completeness, baseline category coverage, eight-outcome completeness, three-cycle progress.
- House 8: outcome register, measurable targets, evidence, risks, protection gaps and exit decisions.
- House 9: quarterly board and Mandalart grid, with resources, dependencies and trust/travel/therapy alignment.
- House 5: the actual sprint task queue. South=to do; East=in progress; North=testing; West=waiting; Done=complete. Rabbit Hole is intake/storylog and Players is ownership, not extra task statuses.
- House 6: seven weekday views filter the same underlying records.
- House 12: Manifestation records the realized result and its evidence; it is not a duplicate of the intended Outcome.

Preserve IDs, provenance and existing data during migrations. Backfill Outcomes from existing exit/event records only after determining their meaning; an event is not automatically a success condition. Retain older records and mark superseded definitions.

## Agent handoffs and tools
Every handoff records framework_version, home_id, goal_id, outcome_id, task_id, owner, input location, expected output, destination, status and completion evidence.
Symphony: user-reported setup for UGC brand opportunity research and outreach workflow; connection and autonomous sending not verified here.
Polar: user-reported assistant/onboarding/handoff role; exact connection not verified here.
MakeThis: proposed delivery platform for customized client versions; vendor, publishing connection and production workflow not verified here.
Treat these as tools supporting Goals, Outcomes, Tasks and Engines. They do not create new Houses. No external brand outreach is authorized by this architecture update alone.

## Implementation acceptance criteria
1. One new quarterly Plan references one primary Goal and exactly eight distinct Outcome slots.
2. The Mandalart view shows 81 cells and repeats existing Outcome IDs; at most 64 task slots.
3. A Task edit is visible through every linked view without duplicate records.
4. Task completion cannot alone mark an Outcome achieved.
5. Exit/stop rules can operate before all Outcomes are achieved.
6. Each Home can hold the three baseline goal/plan pairs and additional Goals.
7. Operating dates and verified astronomical timing remain separately labeled.
8. Every AI context identifies this correction as version 2026-09-24.1.
9. Repository documentation, application context, deployed behavior, Notion schema and Obsidian sync are tracked separately; one does not prove another.
