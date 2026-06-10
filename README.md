# New Castle

**Legal document shell for the Lorraen Madre UFO / WISH WELL operating system**

New Castle is the privacy-minded legal and document management shell for the Lorraen Madre ecosystem. It is designed to help a user upload, organize, summarize, classify, and route important documents into the correct WISH WELL house while preserving a clear trail of intake, tasks, timelines, drafts, and outputs.

Where LORRAEN MADRE UFO is the public-facing Universal Family Office interface, New Castle is the document fortress behind the gate.

It connects first through **House 1** because House 1 holds identity, timing, family business, entity structure, and the first legal container.

## Project Purpose

New Castle exists to make documents usable.

The goal is to move a user from scattered files, legal anxiety, and document overload into a structured system that can support:

- Legal document intake
- Case and timeline organization
- Entity and family-office documentation
- Uploaded document summaries
- Task extraction
- Draft generation
- Template storage
- WISH WELL house routing
- Google Drive vault organization
- Monday.com execution tasks
- Future local/private legal AI testing

This is especially important for users building complex personal, family, nonprofit, business, legal, or trust-related systems where documents need to be sorted before they can become action.

## System Role

| Layer | Role |
|---|---|
| **Lorraen Madre** | Public front door and TIME . space + Story design studio |
| **LORRAEN MADRE UFO** | Universal Family Office interface and roadmap |
| **WISH WELL** | 12/13-house operating system for life, business, legal, story, and strategy |
| **New Castle** | Legal/document shell and document routing engine |
| **Fruitful Frameworks** | Notion AI communication headquarters |
| **Google Drive** | User-owned vault where documents and outputs are stored |
| **Trello / Dream Backlog** | Wish and rabbit-hole capture layer |
| **Monday.com** | Execution layer for tasks, projects, sprints, owners, and timelines |
| **GitHub** | Technical mirror for software build and automation logic |
| **Canva** | Visual/public asset layer |

## Core Concept

New Castle should help answer:

1. What document is this?
2. Who or what does it involve?
3. Which WISH WELL house does it belong to?
4. Is it legal, financial, family, health, business, trust, content, or operational?
5. What dates, deadlines, names, facts, and obligations matter?
6. What task should be created from it?
7. Where should the output live?
8. Does it need to become a Monday.com item, Drive document, GitHub issue, Canva asset, or New Castle draft?

## House 1 Connection

New Castle plugs into **House 1: Identity + Timing / Family Business**.

House 1 is the first container because it holds:

- Identity
- Legal name / public identity / private identity
- Family business structure
- Entity map
- Trust and governance layer
- Timing and review cycles
- UFO master profile
- New Castle connection index

From there, New Castle routes documents into the other WISH WELL houses.

## WISH WELL Document Routing

| House | New Castle Routing Use |
|---|---|
| House 1 | Identity, timing, family business, entities, UFO profile, core legal container |
| House 2 | Assets, money, banking, pricing, value, financial records |
| House 3 | Communication, technology, domains, AI connectors, digital infrastructure |
| House 4 | Home, health, benefits, telemedicine, household care |
| House 5 | Projects, work, creative production, budgets, dependencies |
| House 6 | Systems, habits, SOPs, Fruitful Frameworks, weekly rhythm |
| House 7 | Contracts, agreements, accountability, legal drafts, DEAR MAN scripts |
| House 8 | Risk, insurance, protection, safety plans, compliance |
| House 9 | Trust, travel, therapy, research, curriculum, higher education |
| House 10 | Story, legacy, public authority, press, standards |
| House 11 | Partners, sponsors, outreach, events, community network |
| House 12 | Mind, body, soul, spiritual practice, nervous system regulation |
| House 13 | Creation, alchemy, meta-templates, wish-to-deal process |

## Intended New Castle Vault Structure

```text
03_NEW_CASTLE_CONNECTION
├── 00_New_Castle_Overview
├── 01_Legal_Intake
├── 02_Uploaded_Documents
├── 03_Document_Summaries
├── 04_Legal_Templates
├── 05_Case_Timelines
├── 06_Task_Extraction
├── 07_Output_Drafts
└── 99_Archive
```

## User Flow

1. User enters Lorraen Madre / UFO platform.
2. User connects Google / Gmail.
3. User receives or maps a personal Google Drive UFO vault.
4. New Castle connects through House 1.
5. User uploads or references documents.
6. New Castle identifies document type, key facts, people, dates, deadlines, and risks.
7. New Castle assigns the document to a WISH WELL house.
8. New Castle creates a summary, task list, and next-action recommendation.
9. Approved tasks move into Monday.com.
10. Outputs are saved into Google Drive.

## Launch Settings

Use these settings when importing the repository into Vercel:

- Framework preset: Vite
- Install command: npm install
- Build command: npm run build
- Output directory: dist
- Production domain: newcastlevibes.app

Required runtime/deployment checks:

- Add GEMINI_API_KEY in Vercel environment variables.
- Add newcastlevibes.app and any Vercel preview domain to Firebase Authentication authorized domains.
- Confirm Google sign-in is enabled in Firebase Authentication.
- Confirm Firestore rules are deployed for the AI Studio database used by firebase-applet-config.json.
