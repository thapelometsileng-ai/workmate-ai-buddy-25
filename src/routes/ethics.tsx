import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Eye, ShieldCheck, UserCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/ethics")({
  head: () => ({
    meta: [
      { title: "Ethics & Privacy — WorkWithMe.ai" },
      {
        name: "description",
        content:
          "How WorkWithMe.ai uses AI responsibly: human-in-the-loop review, session-only data handling, transparency and accuracy limits.",
      },
      { property: "og:title", content: "Ethics & Privacy — WorkWithMe.ai" },
      {
        property: "og:description",
        content: "Our responsible AI deployment protocol: human review, privacy and transparency.",
      },
    ],
  }),
  component: EthicsPage,
});

const SECTIONS = [
  {
    icon: UserCheck,
    title: "Human-in-the-loop safeguard",
    body: "Every AI generation — emails, resumes, meeting summaries, schedules and briefs — is a draft that requires human review before it is sent, filed or acted on. The AI assists; a person stays accountable for the outcome.",
  },
  {
    icon: AlertCircle,
    title: "Session-only data handling",
    body: "What you type is sent to the AI model to produce your result and is held in your browser for the duration of your session. Nothing you enter is saved to a database or added to a training set by this app. Close the tab and the session is gone.",
  },
  {
    icon: Eye,
    title: "Transparency about limits",
    body: "The assistant has no live web access and can be confidently wrong. Every tool asks it to state its assumptions and to name the facts, figures and dates you should verify against a primary source before relying on them.",
  },
  {
    icon: ShieldCheck,
    title: "What not to paste here",
    body: "Avoid confidential personal data, identity numbers, health or financial records, and anything covered by an NDA. Decisions about people — hiring, discipline, performance, pay — must be made by a responsible human, never delegated to a generated draft.",
  },
];

function EthicsPage() {
  return (
    <AppShell
      title="Ethics & Privacy"
      description="The responsible deployment protocol behind every tool in this suite."
    >
      <div className="grid max-w-3xl gap-3">
        {SECTIONS.map(({ icon: Icon, title, body }) => (
          <section key={title} className="panel p-5">
            <h2 className="text-brand flex items-center gap-2 text-sm font-semibold">
              <Icon className="size-4" strokeWidth={1.75} />
              {title}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
