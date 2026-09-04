import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Field, GenerateButton, TextArea, TextInput } from "@/components/form-controls";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Resume Builder & ATS Scanner — WorkWithMe.ai" },
      {
        name: "description",
        content:
          "Build a resume with a live preview and score it against any job description with an AI ATS keyword analysis.",
      },
      { property: "og:title", content: "AI Resume Builder & ATS Scanner — WorkWithMe.ai" },
      {
        property: "og:description",
        content:
          "Live resume preview plus an AI match score, missing keywords and a rewritten professional summary.",
      },
    ],
  }),
  component: ResumePage,
});

function scoreFrom(text: string): number | null {
  const m = text.match(/Score:\s*\**\s*(\d{1,3})\s*\/\s*100/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? Math.min(n, 100) : null;
}

function ResumePage() {
  const [data, setData] = useState({
    name: "Alex Mercer",
    title: "AI Solutions Architect",
    email: "alex.mercer@workwithme.ai",
    phone: "+27 (0)11 019 2834",
    summary:
      "Results-driven digital transformation specialist with 5+ years engineering enterprise AI workflows and full-stack cloud applications.",
    skills: "Prompt Engineering, React, Python, Cloud Architecture, Agile Management",
    jobDesc:
      "Seeking an AI Solutions Architect proficient in React, Python, prompt engineering and enterprise deployment.",
  });
  const { output, setOutput, loading, error, generate, regenerate } = useGenerate("resume");
  const score = scoreFrom(output);

  const set = (k: keyof typeof data) => (e: { target: { value: string } }) =>
    setData({ ...data, [k]: e.target.value });

  return (
    <AppShell
      title="AI Resume Builder"
      description="Edit your resume with a live preview, then score it against a target job description with an AI ATS analysis."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-4 p-4 sm:p-5">
          <h2 className="text-brand border-b border-border pb-2 text-sm font-semibold">
            Resume configuration
          </h2>
          <Field label="Full name">
            <TextInput value={data.name} onChange={set("name")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Target job title">
              <TextInput value={data.title} onChange={set("title")} />
            </Field>
            <Field label="Email">
              <TextInput value={data.email} onChange={set("email")} />
            </Field>
          </div>
          <Field label="Phone">
            <TextInput value={data.phone} onChange={set("phone")} />
          </Field>
          <Field label="Professional summary">
            <TextArea rows={4} value={data.summary} onChange={set("summary")} />
          </Field>
          <Field label="Core competencies" hint="comma separated">
            <TextInput value={data.skills} onChange={set("skills")} />
          </Field>
          <div className="space-y-3 border-t border-border pt-4">
            <Field label="Target job description" hint="paste the posting for the ATS match">
              <TextArea rows={4} value={data.jobDesc} onChange={set("jobDesc")} />
            </Field>
            <GenerateButton
              loading={loading}
              disabled={!data.summary.trim()}
              onClick={() => generate(data)}
            >
              Run AI ATS analysis
            </GenerateButton>
          </div>

          {score !== null && !loading && (
            <div className="bg-brand-soft/40 flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-muted-foreground text-xs">AI keyword match</p>
                <p className="text-sm font-semibold">
                  {score >= 80 ? "Strong match" : score >= 60 ? "Solid, needs tuning" : "Needs optimization"}
                </p>
              </div>
              <span className="text-brand font-display text-2xl font-bold">{score}%</span>
            </div>
          )}
        </div>

        {/* Live document preview */}
        <div className="panel flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-xl font-bold tracking-wide">{data.name || "YOUR NAME"}</h2>
              <p className="text-brand text-sm font-medium">{data.title || "Job title"}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {data.email} | {data.phone}
              </p>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-2 text-[10.5px] font-semibold tracking-[0.16em] uppercase">
                Professional summary
              </h3>
              <p className="text-sm leading-relaxed">
                {data.summary || "Summary text will appear here…"}
              </p>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-2 text-[10.5px] font-semibold tracking-[0.16em] uppercase">
                Core competencies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.skills
                  .split(",")
                  .filter((s) => s.trim())
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="bg-secondary text-secondary-foreground rounded border border-border px-2.5 py-1 text-[11px]"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className="text-muted-foreground mt-8 flex items-center justify-between border-t border-border pt-5 text-xs">
            <span className="flex items-center gap-1.5">
              <Sparkles className="text-brand size-3.5" strokeWidth={1.75} /> Live preview
            </span>
            <button
              onClick={() => window.print()}
              className="bg-secondary text-secondary-foreground hover:bg-accent rounded-lg border border-border px-3 py-1.5 transition-colors"
            >
              Export document
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={regenerate}
          emptyHint="Your AI ATS score, matched and missing keywords, and a rewritten summary will appear here."
        />
      </div>
    </AppShell>
  );
}
