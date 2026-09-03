import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { ChipGroup, Field, GenerateButton, TextArea, TextInput } from "@/components/form-controls";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Nexa" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a formal, friendly, persuasive, apologetic, direct or diplomatic tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Nexa" },
      {
        property: "og:description",
        content: "Draft clear, tone-matched workplace emails in seconds, then edit before sending.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Apologetic", "Direct", "Diplomatic"] as const;

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState<string>("Formal");
  const [length, setLength] = useState("Medium (3 short paragraphs)");
  const { output, setOutput, loading, error, generate, regenerate } = useGenerate("email");

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the situation, pick a tone, and get a subject line plus a ready-to-send body."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="panel space-y-4 p-4 sm:p-5 lg:col-span-2">
          <Field label="Recipient" hint="name and role">
            <TextInput
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Priya, Head of Operations"
            />
          </Field>
          <Field label="Tone">
            <ChipGroup options={TONES} value={tone} onChange={setTone} />
          </Field>
          <Field label="Length">
            <ChipGroup
              options={["Short (under 80 words)", "Medium (3 short paragraphs)", "Detailed"]}
              value={length}
              onChange={setLength}
            />
          </Field>
          <Field label="What needs to be said?" hint="the more specific, the better">
            <TextArea
              rows={7}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Ask for sign-off on the Q3 roadmap before Thursday's planning sync. Scope is final; two design review items still open."
            />
          </Field>
          <GenerateButton
            loading={loading}
            disabled={!brief.trim()}
            onClick={() => generate({ recipient, brief, tone, length })}
          >
            Generate email
          </GenerateButton>
        </div>

        <div className="lg:col-span-3">
          <OutputPanel
            value={output}
            onChange={setOutput}
            loading={loading}
            error={error}
            onRegenerate={regenerate}
            emptyHint="Your drafted email will appear here — fully editable before you send it."
          />
        </div>
      </div>
    </AppShell>
  );
}
