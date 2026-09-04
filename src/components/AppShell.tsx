import { Link, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  FileText,
  FileUser,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { ChatWidget } from "@/components/ChatWidget";

export const NAV = [
  { to: "/", label: "AI Resume Builder", icon: FileUser, blurb: "Draft & ATS match" },
  { to: "/email", label: "Smart Email Generator", icon: Mail, blurb: "Draft in any tone" },
  { to: "/notes", label: "Meeting Summarizer", icon: FileText, blurb: "Decisions & actions" },
  { to: "/planner", label: "Task Planner", icon: Calendar, blurb: "Prioritise & schedule" },
  { to: "/research", label: "Research Assistant", icon: Search, blurb: "Briefs & insights" },
  { to: "/ethics", label: "Ethics & Privacy", icon: ShieldCheck, blurb: "How we use AI" },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground border border-brand/25 font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
            }`}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="bg-brand text-brand-foreground grid size-9 place-items-center rounded-xl font-display text-sm font-bold">
        W
      </div>
      <div className="leading-tight">
        <p className="text-sidebar-accent-foreground font-display text-[15px] font-semibold">
          WorkWithMe.ai
        </p>
        <p className="text-sidebar-foreground/60 text-[10px] tracking-[0.16em] uppercase">
          Enterprise Suite
        </p>
      </div>
    </div>
  );
}

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border border-border bg-muted/60 px-3 py-2.5 ${compact ? "" : "mt-8"}`}
    >
      <ShieldCheck className="text-brand mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <p className="text-muted-foreground text-[11.5px] leading-relaxed">
        <span className="text-foreground font-medium">Responsible AI:</span> WorkWithMe.ai generates
        suggestions, not decisions. Output can be incomplete or wrong — review facts, names, dates
        and tone before sending or acting. Don't paste confidential personal data, and keep a human
        accountable for anything that affects people.
      </p>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      {/* Desktop sidebar */}
      <aside className="bg-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-border p-4 lg:flex">
        <div>
          <Brand />
          <div className="mt-7">
            <p className="text-sidebar-foreground/50 mb-2 px-3 text-[10px] tracking-[0.16em] uppercase">
              Workspace
            </p>
            <NavList />
          </div>
        </div>
        <div className="text-sidebar-foreground/70 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[11px]">
          <span className="bg-brand size-2 animate-pulse rounded-full" />
          System active &amp; secure
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="bg-sidebar sticky top-0 z-40 flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <Brand />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="text-sidebar-foreground hover:bg-sidebar-accent grid size-9 place-items-center rounded-lg"
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="bg-background/70 absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <div className="bg-sidebar absolute inset-y-0 left-0 w-72 border-r border-border p-4">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="text-sidebar-foreground grid size-9 place-items-center rounded-lg"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="mt-6">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-10">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold sm:text-[28px]">{title}</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">{description}</p>
          </header>
          {children}
          <Disclaimer />
        </div>
      </main>

      <footer className="bg-sidebar/90 fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-[11px] backdrop-blur-md lg:left-64 lg:px-6">
        <span className="text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="text-brand size-4 shrink-0" strokeWidth={1.75} />
          <span className="hidden sm:inline">
            AI safeguard: every generation is reviewed by a human before it leaves this app.
          </span>
          <span className="sm:hidden">Human review required</span>
        </span>
        <span className="text-muted-foreground">WorkWithMe.ai © 2026</span>
      </footer>

      <ChatWidget />
    </div>
  );
}
