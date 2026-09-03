import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { ChipGroup, Field, GenerateButton, TextArea, TextInput } from "@/components/form-controls";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Nexa" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritised, time-blocked daily or weekly schedule with realistic buffers.",
      },
      { property: "og:title", content: "AI Task Planner — Nexa" },
      {
        property: "og:description",
        content: "Prioritise tasks and time-block a realistic day or week with AI.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [fixed, setFixed] = useState("");
  const [hours, setHours] = useState("08:30–17:00");
  const [horizon, setHorizon] = useState("Daily");
  const { output, setOutput, loading, error, generate, regenerate } = useGenerate("planner");

  return (
    <AppShell
      title="AI Task Planner"
      description="Dump your tasks. Nexa ranks them by urgency and importance, then time-blocks a schedule you can actually keep."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="panel space-y-4 p-4 sm:p-5 lg:col-span-2">
          <Field label="Horizon">
            <ChipGroup options={["Daily", "Weekly"]} value={horizon} onChange={setHorizon} />
          </Field>
          <Field label="Working hours">
            <TextInput value={hours} onChange={(e) => setHours(e.target.value)} />
          </Field>
          <Field label="Fixed commitments" hint="meetings you can't move">
            <TextArea
              rows={3}
              value={fixed}
              onChange={(e) => setFixed(e.target.value)}
              placeholder="09:00 standup (15 min), 14:00 client sync (1 hr)"
            />
          </Field>
          <Field label="Tasks & goals" hint="one per line">
            <TextArea
              rows={8}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Finish Q3 roadmap deck\nReview 5 design tickets\nDraft investor update\nInterview debrief notes"}
            />
          </Field>
          <GenerateButton
            loading={loading}
            disabled={!tasks.trim()}
            onClick={() => generate({ tasks, fixed, hours, horizon: horizon.toLowerCase() })}
          >
            Build my schedule
          </GenerateButton>
        </div>

        <div className="lg:col-span-3">
          <OutputPanel
            value={output}
            onChange={setOutput}
            loading={loading}
            error={error}
            onRegenerate={regenerate}
            emptyHint="Your prioritised task table and time-blocked schedule will appear here."
          />
        </div>
      </div>
    </AppShell>
  );
}
