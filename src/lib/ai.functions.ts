import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const BASE_GUARDRAILS = `
You are an assistant inside a workplace productivity platform used by professionals.
Rules you always follow:
- Be accurate and concise. Never invent facts, names, numbers, dates or citations.
- If information is missing, state the assumption explicitly in an "Assumptions" line instead of guessing silently.
- Never include personal opinions on protected characteristics, and never produce content that could mislead a recipient.
- Output clean Markdown that a professional could paste into a work tool with minimal editing.
`.trim();

const PROMPTS = {
  email: (d: Record<string, string>) => `
${BASE_GUARDRAILS}

TASK: Write a professional workplace email.

Recipient: ${d["recipient"] || "the recipient"}
Tone: ${d["tone"]}
Desired length: ${d["length"]}
Purpose / key points from the user:
"""
${d["brief"]}
"""

Structure your answer exactly as:
**Subject:** <one short, specific subject line>

<email body with greeting, 1-3 tight paragraphs, an explicit ask or next step, and a sign-off>

Match the requested tone precisely. Do not add placeholders like [Your Name] more than once.`,

  notes: (d: Record<string, string>) => `
${BASE_GUARDRAILS}

TASK: Summarize raw meeting notes or a transcript.

Meeting context: ${d["context"] || "not provided"}
Raw notes:
"""
${d["notes"]}
"""

Return Markdown with these sections, in this order, omitting none:
## Summary
3-5 bullet points of what was discussed.
## Decisions
Each decision made, one per bullet. Write "No explicit decisions recorded." if none.
## Action Items
A Markdown table with columns | Owner | Action | Due date |. Use "Unassigned" / "No date" when the notes do not say.
## Deadlines & Key Dates
Bullets, or "None mentioned."
## Open Questions
Bullets of anything unresolved or ambiguous in the notes.`,

  planner: (d: Record<string, string>) => `
${BASE_GUARDRAILS}

TASK: Build a realistic ${d["horizon"]} work schedule.

Working hours: ${d["hours"]}
Fixed commitments: ${d["fixed"] || "none given"}
Tasks and goals from the user:
"""
${d["tasks"]}
"""

Method: classify every task by urgency and importance (Eisenhower), then time-block it.
Return Markdown with:
## Priorities
A table | Task | Priority (P1-P3) | Est. effort | Rationale |
## Schedule
For each day (or the single day), a table | Time block | Focus | Why now |
Include realistic breaks and buffer time. Do not overbook: leave at least 15% of the day unscheduled.
## Watch-outs
Bullets on risks, dependencies, or tasks that should be delegated or dropped.`,

  research: (d: Record<string, string>) => `
${BASE_GUARDRAILS}
You have no live web access, so rely only on the supplied material and general knowledge, and flag anything that needs verification.

TASK: Research briefing for a workplace audience.

Topic / question: ${d["topic"]}
Audience: ${d["audience"]}
Source material supplied by the user (may be empty):
"""
${d["source"] || "none supplied"}
"""

Return Markdown with:
## Executive summary
Three sentences maximum.
## Key findings
5-7 bullets, each one concrete claim.
## Insights & implications
What this means for the audience specifically.
## Recommendations
Numbered, action-oriented, each with a first step.
## Verify before relying on this
Bullets naming the specific claims, figures or dates that should be checked against a primary source.`,
} as const;

const GenerateInput = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  fields: z.record(z.string()),
});

async function runPrompt(system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing key).");

  const { createLovableAiGatewayProvider, WORKPLACE_MODEL } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(key);

  const result = streamText({
    model: gateway(WORKPLACE_MODEL),
    system,
    prompt,
  });

  return await result.text;
}

export const generateWorkplaceContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = PROMPTS[data.tool](data.fields);
    const text = await runPrompt(
      "You are Nexa, an AI workplace productivity assistant. Follow the task format exactly.",
      prompt,
    );
    return { text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing key).");

    const { createLovableAiGatewayProvider, WORKPLACE_MODEL } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const result = streamText({
      model: gateway(WORKPLACE_MODEL),
      system: `${BASE_GUARDRAILS}

You are Nexa, an AI workplace assistant. You help with drafting, planning, summarizing and thinking through work problems.
Answer in Markdown. Keep replies tight — bullets over paragraphs when listing.
If a request needs judgement a human must own (HR decisions, legal, medical, financial advice), give useful structure but tell the user to confirm with the responsible person.`,
      messages: data.messages,
    });

    return { text: await result.text };
  });
