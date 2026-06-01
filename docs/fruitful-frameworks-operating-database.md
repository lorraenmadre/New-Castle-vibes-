# Fruitful Frameworks Operating Database Protocol

This document connects New Castle to the Fruitful Frameworks Operating Database.

Google Sheet:
https://docs.google.com/spreadsheets/d/1NazA22tK9pAMokK7D5GqZgg-vrpl_do2ajjRCgj2Kow/edit

## Role of the Sheet

The Operating Database is the automation-friendly Google Sheets layer for WISH WELL routing, CrewAI agent routing, Composio tool use, Google Drive vault indexing, approvals, and task queues.

## Role of New Castle

New Castle is the legal/document shell. It should not act as final legal authority. It should help route documents, extract facts, organize timelines, flag missing information, and generate review-ready summaries.

## New Castle Read Order

When handling a document or legal/admin input, New Castle should reference:

1. `01_WISH_WELL_HOUSES`
2. `05_TOOL_ROUTING`
3. `06_TASK_QUEUE`
4. `07_APPROVAL_QUEUE`
5. `11_DRIVE_VAULT_INDEX`

## Relevant Houses

| House | Use in New Castle |
|---|---|
| House 01 | Identity, entity, family business, UFO profile |
| House 07 | Contracts, agreements, accountability, court/admin documents |
| House 08 | Risk, insurance, protection, safety, due diligence |
| House 09 | Research, education, trust, therapy/support references |
| House 10 | Story, public authority, legacy, timeline/narrative |

## Human Review Rule

Human review is required for legal, medical, tax, financial, insurance, safety, custody, benefits, compliance, or credit-related actions.

New Castle may organize facts, links, timelines, and next-action drafts, but it must not create final claims, final filings, final disputes, or final advice without review.

## Approval Rule

Founder approval is required before actions involving:

- Sending external messages
- Public publishing
- Legal/admin documents
- Money, finance, credit, insurance, or fundraising
- Health, safety, custody, benefits, or compliance matters
- Credentials, domains, account creation, app deployment, file deletion, or user data

## First Implementation Target

The first useful New Castle automation is:

1. Receive or locate a document.
2. Identify document type.
3. Extract names, dates, deadlines, obligations, risks, and missing information.
4. Assign WISH WELL house.
5. Save the summary to Drive or Notion.
6. If action is clear, create a row in `06_TASK_QUEUE`.
7. If approval is required, create a row in `07_APPROVAL_QUEUE`.

## Status

This protocol mirrors the UFO repo database protocol and keeps New Castle aligned with Fruitful Frameworks instead of letting it become a rogue legal goblin with a folder habit.
