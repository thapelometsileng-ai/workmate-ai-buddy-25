# Nexa — AI Workplace Productivity Assistant

One integrated platform that helps professionals automate everyday workplace tasks with AI.

## Project overview

Nexa is a single dashboard containing five AI-powered assistants. Every tool uses a structured
prompt (role, guardrails, typed inputs, fixed output contract) instead of free-form chat, so the
results are consistent, comparable and paste-ready — and every output is editable by the human
before it leaves the app.

## Features

| Tool | What it does |
| --- | --- |
| Smart Email Generator | Professional emails in six tones (formal, friendly, persuasive, apologetic, direct, diplomatic) with subject line and length control |
| Meeting Notes Summarizer | Turns raw notes/transcripts into a summary, decisions, an owner/action/due-date table, deadlines and open questions |
| AI Task Planner | Eisenhower prioritisation plus a realistic time-blocked daily or weekly schedule with buffers and watch-outs |
| AI Research Assistant | Executive summary, key findings, implications, recommendations and an explicit "verify before relying on this" section |
| AI Chatbot Interface | Conversational workplace assistant that receives the full conversation history each turn |

Also included: dashboard layout, sidebar navigation (drawer on mobile), fully responsive design,
structured input panels beside editable output panels, copy/regenerate actions, and a Responsible
AI disclaimer on every screen.

## Responsible AI practices

- Persistent disclaimer: AI output is a suggestion, not a decision.
- System guardrails forbid inventing facts, names, numbers, dates or citations.
- Missing information must be surfaced as explicit assumptions.
- Research output always names the claims requiring verification.
- Requests needing human judgement (HR, legal, medical, financial) are routed back to a human owner.
- Users are told not to paste confidential personal data.
- All output is editable before use — a human stays accountable.

## Tools used

- Lovable AI (AI gateway) with the Vercel AI SDK
- TanStack Start (React 19, SSR) + TanStack Router
- Tailwind CSS v4 design tokens
- TypeScript, Zod validation, react-markdown

## Setup instructions

```bash
bun install
bun run dev
```

The app runs on http://localhost:8080. AI calls run server-side via TanStack server functions
(`src/lib/ai.functions.ts`); the API key is never exposed to the browser.

## Project structure

```
src/
  components/    AppShell (sidebar + disclaimer), OutputPanel, form controls
  lib/           ai-gateway.server.ts, ai.functions.ts (prompts), use-generate.ts
  routes/        index, email, notes, planner, research, chat
```
