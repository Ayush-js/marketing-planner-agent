import { useState } from "react";
import clsx from "clsx";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Sparkles,
  Users,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import type { PlanSchedule } from "../types";

const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/plan`
  : "/api/plan";

export function PlannerPanel() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<PlanSchedule | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSchedule(null);
    const trimmed = goal.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
  const raw = typeof data.detail === "string"
    ? data.detail
    : Array.isArray(data.detail)
      ? data.detail.map((d: { msg?: string }) => d.msg).join(", ")
      : "Request failed";

  if (raw.includes("401") || raw.includes("invalid_api_key") || raw.includes("Invalid API Key")) {
    setError("The Groq API key is missing or invalid. Please set a valid GROQ_API_KEY in your environment.");
  } else if (raw.includes("503") || raw.includes("GROQ_API_KEY is not set")) {
    setError("The backend is not configured. Please add your GROQ_API_KEY to the server environment.");
  } else if (raw.includes("500")) {
    setError("The server encountered an error. Please try again in a moment.");
  } else if (raw.includes("429")) {
    setError("Too many requests. Please wait a moment and try again.");
  } else {
    setError("Something went wrong. Please try again.");
  }
  return;
}
      setSchedule(data.schedule as PlanSchedule);
    } catch (err) {
  setError(err instanceof Error && err.message.includes("fetch")
    ? "Unable to reach the server. Please check your connection and try again."
    : "Something went wrong. Please try again.");
}finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-500/5" />
      <div className="relative">
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-300">
          <Sparkles className="h-4 w-4" />
          AI marketing planner
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm text-zinc-600 dark:text-zinc-400">
            Your marketing goal
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              placeholder='e.g. "Launch a 4-week social campaign for a new product"'
              className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-black/30 dark:text-zinc-100"
              disabled={loading}
            />
          </label>
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className={clsx(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition",
              "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating plan…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate execution plan
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {schedule && (
          <div className="mt-8 space-y-6 border-t border-zinc-200 pt-8 dark:border-white/10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                icon={<Wallet className="h-4 w-4" />}
                label="Total budget"
                value={`$${Number(schedule.summary.total_budget).toLocaleString()}`}
              />
              <Stat
                icon={<CalendarDays className="h-4 w-4" />}
                label="Project duration"
                value={`${schedule.summary.project_duration} days`}
              />
              <Stat
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Tasks ready"
                value={`${schedule.ready_count} / ${schedule.total_tasks}`}
              />
              <Stat
                icon={<Users className="h-4 w-4" />}
                label="Team"
                value={
                  schedule.summary.team_involved.length
                    ? schedule.summary.team_involved.join(", ")
                    : "—"
                }
                small
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Timeline
              </h3>
              <ul className="space-y-3">
                {schedule.timeline.length === 0 && (
                  <li className="text-sm text-zinc-500">No tasks could be scheduled.</li>
                )}
                {schedule.timeline.map((t) => (
                  <li
                    key={t.order}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-black/20"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.order}. {t.task_name}
                      </span>
                      <span className="text-sm text-sky-700 dark:text-sky-300">
                        Day {t.start_day} → {t.end_day}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {t.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                      <span>${t.estimated_cost}</span>
                      <span>{t.team_members.join(", ")}</span>
                      {t.depends_on.length > 0 && (
                        <span>After: {t.depends_on.join(", ")}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {schedule.flagged.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                  Flagged
                </h3>
                <ul className="space-y-2">
                  {schedule.flagged.map((f) => (
                    <li
                      key={f.task_name}
                      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-500/20 dark:bg-amber-500/5"
                    >
                      <div className="font-medium text-amber-900 dark:text-amber-100">
                        {f.task_name}
                      </div>
                      <ul className="mt-1 list-disc pl-4 text-amber-900/80 dark:text-amber-200/80">
                        {f.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-zinc-500">
              Generated at {schedule.generated_at}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-black/20">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <div
        className={clsx(
          "mt-1 font-semibold text-zinc-900 dark:text-zinc-100",
          small && "text-sm font-normal leading-snug"
        )}
      >
        {value}
      </div>
    </div>
  );
}
