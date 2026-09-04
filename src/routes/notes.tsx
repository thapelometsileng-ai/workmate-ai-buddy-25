import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Field, GenerateButton, TextArea, TextInput } from "@/components/form-controls";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkWithMe.ai" },
      {
        name: "description",
        content:
          "Turn long meeting notes or transcripts into a summary with decisions, owned action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkWithMe.ai" },
      {
        property: "og:description",
        content: "Extract decisions, action items and deadlines from raw meeting notes instantly.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [context, setContext] = useState("");
  const [notes, setNotes] = useState("");
  const { output, setOutput, loading, error, generate, regenerate } = useGenerate("notes");

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. Get a summary, decisions, an owner-by-owner action table and deadlines."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="panel space-y-4 p-4 sm:p-5 lg:col-span-2">
          <Field label="Meeting context" hint="optional">
            <TextInput
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Weekly ops standup, 8 attendees"
            />
          </Field>
          <Field label="Raw notes or transcript">
            <TextArea
              rows={14}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste everything — bullet fragments, typos and cross-talk are fine."
            />
          </Field>
          <GenerateButton
            loading={loading}
            disabled={!notes.trim()}
            onClick={() => generate({ context, notes })}
          >
            Summarize notes
          </GenerateButton>
        </div>

        <div className="lg:col-span-3">
          <OutputPanel
            value={output}
            onChange={setOutput}
            loading={loading}
            error={error}
            onRegenerate={regenerate}
            emptyHint="Your summary, decisions, action items and deadlines will appear here."
          />
        </div>
      </div>
    </AppShell>
  );
}
