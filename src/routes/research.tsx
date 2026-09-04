import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { ChipGroup, Field, GenerateButton, TextArea, TextInput } from "@/components/form-controls";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkWithMe.ai" },
      {
        name: "description",
        content:
          "Summarize a topic or pasted article into an executive brief with key findings, implications and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — WorkWithMe.ai" },
      {
        property: "og:description",
        content: "Executive research briefs with findings, insights, recommendations and what to verify.",
      },
    ],
  }),
  component: ResearchPage,
});

const AUDIENCES = ["Exec leadership", "My team", "A client", "Myself"] as const;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const [audience, setAudience] = useState<string>("Exec leadership");
  const { output, setOutput, loading, error, generate, regenerate } = useGenerate("research");

  return (
    <AppShell
      title="AI Research Assistant"
      description="Ask a question or paste an article. WorkWithMe.ai returns a briefing — and tells you which claims to verify."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="panel space-y-4 p-4 sm:p-5 lg:col-span-2">
          <Field label="Topic or question">
            <TextInput
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="How should mid-size firms approach AI governance?"
            />
          </Field>
          <Field label="Audience">
            <ChipGroup options={AUDIENCES} value={audience} onChange={setAudience} />
          </Field>
          <Field label="Source material" hint="optional — paste an article or report">
            <TextArea
              rows={10}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste the text you want summarized and analysed."
            />
          </Field>
          <GenerateButton
            loading={loading}
            disabled={!topic.trim()}
            onClick={() => generate({ topic, source, audience })}
          >
            Build research brief
          </GenerateButton>
        </div>

        <div className="lg:col-span-3">
          <OutputPanel
            value={output}
            onChange={setOutput}
            loading={loading}
            error={error}
            onRegenerate={regenerate}
            emptyHint="Your executive summary, findings, insights and recommendations will appear here."
          />
        </div>
      </div>
    </AppShell>
  );
}
