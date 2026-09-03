import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUp, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/AppShell";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Nexa" },
      {
        name: "description",
        content:
          "An interactive AI workplace assistant for drafting, planning, summarizing and thinking through work problems.",
      },
      { property: "og:title", content: "Assistant Chat — Nexa" },
      {
        property: "og:description",
        content: "Chat with an AI workplace assistant that keeps full conversation context.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Help me say no to a meeting request politely",
  "Turn this week's goals into three priorities",
  "What should I ask in a project kickoff?",
];

function ChatPage() {
  const send = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      // Send the full history every turn — the model keeps no memory of its own.
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? `Couldn't get a reply: ${e.message}`
          : "Couldn't reach the AI service. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Assistant Chat"
      description="Your always-on workplace assistant. It remembers the conversation, not your data."
    >
      <div className="panel flex h-[62vh] min-h-[420px] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {messages.length === 0 && (
            <div className="py-8 text-center">
              <span className="bg-brand-soft text-accent-foreground mx-auto grid size-11 place-items-center rounded-xl">
                <Bot className="size-5" strokeWidth={1.75} />
              </span>
              <p className="mt-3 text-sm font-medium">How can I help with your work today?</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="bg-secondary text-secondary-foreground hover:bg-accent rounded-full px-3 py-1.5 text-xs transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose-ai">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          ))}

          {loading && (
            <div className="bg-muted text-muted-foreground w-fit rounded-xl rounded-bl-sm px-3.5 py-2.5 text-sm">
              <span className="animate-pulse">Nexa is thinking…</span>
            </div>
          )}

          {error && (
            <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border px-3 py-2.5 text-sm">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the assistant…"
            className="focus:ring-ring flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-lg transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-4" strokeWidth={2} />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
