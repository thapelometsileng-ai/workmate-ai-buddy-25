import type { ReactNode } from "react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-foreground text-xs font-medium">{label}</span>
      {hint && <span className="text-muted-foreground ml-1.5 text-[11px]">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const base =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring focus:outline-none";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} resize-y`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={base} />;
}

export function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            value === o
              ? "bg-brand text-brand-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function GenerateButton({
  loading,
  disabled,
  children,
  onClick,
}: {
  loading: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Working…" : children}
    </button>
  );
}
