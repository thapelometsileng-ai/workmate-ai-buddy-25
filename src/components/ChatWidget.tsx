import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { chatWithAssistant } from "@/lib/ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hello! I'm the WorkWithMe assistant. Ask me to draft something, unpack a decision, or explain any tool in this suite.",
};

export function ChatWidget() {
  const send = useServerFn(chatWithAssistant);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await send({ data: { messages: next.filter((m) => m !== GREETING) } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? `The assistant couldn't answer: ${err.message}`
          : "The assistant is unavailable right now. Please try again.",
      );
    } finally {
      setLoading(false);
      field.current?.focus();
    }
  };

  return (
    <div className="fixed right-4 bottom-16 z-50 sm:right-6">
      {open ? (
        <div className="panel flex h-[26rem] w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden shadow-2xl">
          <div className="bg-background flex items-center justify-between border-b border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-brand size-4" strokeWidth={1.75} />
              <span className="text-xs font-semibold">WorkWithMe Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          </div>

          <div ref={scroller} className="flex-1 space-y-2.5 overflow-y-auto p-3 text-xs">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "user" ? (
                  <p className="bg-brand text-brand-foreground max-w-[85%] rounded-lg px-2.5 py-2 font-medium">
                    {m.content}
                  </p>
                ) : (
                  <div className="prose-ai text-foreground max-w-[92%] text-xs">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {loading && <p className="text-brand animate-pulse">Thinking…</p>}
            {error && <p className="text-destructive">{error}</p>}
          </div>

          <form onSubmit={submit} className="bg-background flex gap-2 border-t border-border p-2">
            <input
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="focus:ring-ring flex-1 rounded-md border border-input bg-card px-2 py-1.5 text-xs focus:ring-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Send message"
              className="bg-brand text-brand-foreground grid size-8 place-items-center rounded-md disabled:opacity-50"
            >
              <Send className="size-3.5" strokeWidth={2} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant"
          className="bg-brand text-brand-foreground grid size-12 place-items-center rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <MessageSquare className="size-5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
