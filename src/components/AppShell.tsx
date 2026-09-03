import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  ShieldCheck,
  Telescope,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Overview & activity" },
  { to: "/email", label: "Email Generator", icon: Mail, blurb: "Draft in any tone" },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen, blurb: "Actions & decisions" },
  { to: "/planner", label: "Task Planner", icon: CalendarClock, blurb: "Prioritise & schedule" },
  { to: "/research", label: "Research Assistant", icon: Telescope, blurb: "Briefs & insights" },
  { to: "/chat", label: "Assistant Chat", icon: Bot, blurb: "Ask anything" },
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
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      <div className="bg-sidebar-primary text-sidebar-primary-foreground grid size-9 place-items-center rounded-xl font-display text-sm font-bold">
        N
      </div>
      <div className="leading-tight">
        <p className="text-sidebar-accent-foreground font-display text-[15px] font-semibold">
          Nexa
        </p>
        <p className="text-sidebar-foreground/60 text-[10px] tracking-[0.16em] uppercase">
          Workplace AI
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
        <span className="text-foreground font-medium">Responsible AI:</span> Nexa generates
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
      <aside className="bg-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between p-4 lg:flex">
        <div>
          <Brand />
          <div className="mt-7">
            <p className="text-sidebar-foreground/50 mb-2 px-3 text-[10px] tracking-[0.16em] uppercase">
              Workspace
            </p>
            <NavList />
          </div>
        </div>
        <p className="text-sidebar-foreground/50 px-3 text-[11px] leading-relaxed">
          Powered by Lovable AI · always review AI output before use.
        </p>
      </aside>

      {/* Mobile top bar */}
      <header className="bg-sidebar sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
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
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="bg-sidebar absolute inset-y-0 left-0 w-72 p-4">
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
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold sm:text-[28px]">{title}</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">{description}</p>
          </header>
          {children}
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
