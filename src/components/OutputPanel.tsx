import { Check, Copy, Pencil, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export function OutputPanel({
  value,
  onChange,
  loading,
  error,
  onRegenerate,
  emptyHint,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
  emptyHint: string;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <section className="panel flex min-h-[420px] flex-col p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
        <p className="text-muted-foreground text-[10.5px] font-medium tracking-[0.16em] uppercase">
          AI output
        </p>
        {value && !loading && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setEditing((e) => !e)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                editing
                  ? "bg-brand text-brand-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              <Pencil className="size-3.5" strokeWidth={1.75} />
              {editing ? "Done" : "Edit"}
            </button>
            <button
              onClick={copy}
              className="bg-secondary text-secondary-foreground hover:bg-accent flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
            >
              {copied ? (
                <Check className="size-3.5" strokeWidth={2} />
              ) : (
                <Copy className="size-3.5" strokeWidth={1.75} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onRegenerate}
              className="bg-secondary text-secondary-foreground hover:bg-accent flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
            >
              <RefreshCw className="size-3.5" strokeWidth={1.75} />
              Regenerate
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 pt-4">
        {error && (
          <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border px-3 py-2.5 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-2.5">
            <div className="text-brand flex items-center gap-2 text-xs font-medium">
              <Sparkles className="size-3.5 animate-pulse" strokeWidth={1.75} />
              Generating…
            </div>
            {[..."12345"].map((k, i) => (
              <div
                key={k}
                className="bg-muted h-3 animate-pulse rounded"
                style={{ width: `${95 - i * 12}%` }}
              />
            ))}
          </div>
        )}

        {!loading && !error && !value && (
          <p className="text-muted-foreground py-12 text-center text-sm">{emptyHint}</p>
        )}

        {!loading && value && editing && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="focus:ring-ring h-[440px] w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-[13px] leading-relaxed focus:ring-2 focus:outline-none"
          />
        )}

        {!loading && value && !editing && (
          <div className="prose-ai text-foreground">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        )}
      </div>
    </section>
  );
}
