import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppShell, NAV } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexa — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One dashboard for AI-drafted emails, meeting summaries, prioritised schedules, research briefs and a workplace chat assistant.",
      },
      { property: "og:title", content: "Nexa — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate everyday workplace tasks with AI: emails, meeting notes, task planning, research and chat — in one platform.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "AI tools", value: "5" },
  { label: "Tones supported", value: "6" },
  { label: "Editable output", value: "100%" },
];

function Dashboard() {
  const tools = NAV.filter((n) => n.to !== "/");

  return (
    <AppShell
      title="Your AI workspace"
      description="Five focused assistants for the work that eats your week. Structured prompts in, editable drafts out."
    >
      <section className="panel bg-primary text-primary-foreground border-transparent p-5 sm:p-6">
        <div className="text-primary-foreground/70 flex items-center gap-2 text-[10.5px] tracking-[0.16em] uppercase">
          <Sparkles className="size-3.5" strokeWidth={1.75} />
          Powered by Lovable AI
        </div>
        <h2 className="mt-3 max-w-xl text-xl leading-snug font-semibold sm:text-[22px]">
          Turn scattered notes, half-formed emails and overloaded to-do lists into finished work.
        </h2>
        <div className="mt-5 flex flex-wrap gap-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-semibold">{s.value}</p>
              <p className="text-primary-foreground/70 text-[11px]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {tools.map(({ to, label, blurb, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="panel group flex items-start gap-3 p-4 transition-shadow hover:shadow-md"
          >
            <span className="bg-brand-soft text-accent-foreground grid size-10 shrink-0 place-items-center rounded-lg">
              <Icon className="size-[18px]" strokeWidth={1.75} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{label}</span>
              <span className="text-muted-foreground block text-xs">{blurb}</span>
            </span>
            <ArrowRight
              className="text-muted-foreground mt-2.5 size-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </Link>
        ))}
      </div>

      <section className="panel mt-5 p-5">
        <h2 className="text-base font-semibold">How Nexa prompts the model</h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            <span className="text-foreground font-medium">Role + guardrails.</span> Every request is
            framed as a workplace assistant that must not invent facts, names or dates.
          </li>
          <li>
            <span className="text-foreground font-medium">Structured inputs.</span> Tone, audience,
            horizon and constraints are collected as fields, not free text, so prompts stay
            consistent.
          </li>
          <li>
            <span className="text-foreground font-medium">Fixed output contract.</span> Each tool
            specifies exact sections and tables, so results are comparable and paste-ready.
          </li>
          <li>
            <span className="text-foreground font-medium">Human in the loop.</span> Output is
            editable, regenerable and shipped with a verification section.
          </li>
        </ul>
      </section>
    </AppShell>
  );
}
