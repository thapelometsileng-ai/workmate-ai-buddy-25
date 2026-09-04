import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { generateWorkplaceContent } from "./ai.functions";

type Tool = "email" | "notes" | "planner" | "research" | "resume";

export function useGenerate(tool: Tool) {
  const run = useServerFn(generateWorkplaceContent);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const last = useRef<Record<string, string> | null>(null);

  const generate = useCallback(
    async (fields: Record<string, string>) => {
      last.current = fields;
      setLoading(true);
      setError(null);
      try {
        const res = await run({ data: { tool, fields } });
        setOutput(res.text);
      } catch (e) {
        setError(
          e instanceof Error && e.message
            ? `Couldn't generate that: ${e.message}`
            : "Couldn't reach the AI service. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [run, tool],
  );

  const regenerate = useCallback(() => {
    if (last.current) void generate(last.current);
  }, [generate]);

  return { output, setOutput, loading, error, generate, regenerate };
}
