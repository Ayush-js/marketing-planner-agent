import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  Layers,
  Menu,
  Moon,
  Shield,
  Sun,
  Users,
  X,
  Zap,
} from "lucide-react";
import { PlannerPanel } from "./components/PlannerPanel";

const nav = [
  { href: "#how", label: "How it Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const logos = ["Acme", "Orbital", "Nimbus", "Stacked", "Pulse", "Vertex", "Lumen", "Craft"];

const testimonials = [
  {
    quote:
      "The AI-driven analytics from our stack have shortened planning cycles. Insights are faster and clearer than spreadsheets alone.",
    name: "Alex Rivera",
    role: "CTO at InnovateTech",
  },
  {
    quote:
      "Campaign planning that used to take days now lands in one pass. Our team finally works from one execution timeline.",
    name: "Samantha Lee",
    role: "Marketing Director at NextGen Solutions",
  },
  {
    quote:
      "As a startup we need speed. This planner keeps budget, team, and timeline honest before we commit.",
    name: "Raj Patel",
    role: "Founder at Startup Grid",
  },
];

const faqs = [
  {
    q: "What does the Marketing Planner do?",
    a: "You describe a marketing goal in plain language. The agent breaks it into tasks, checks budget, team, and timeline constraints, then returns an ordered execution schedule.",
  },
  {
    q: "How does it work under the hood?",
    a: "A large language model proposes tasks with costs and timing. Local validation rules simulate budget approval, availability, and schedule conflicts before anything is finalized.",
  },
  {
    q: "Is my data secure?",
    a: "Your goal is sent to your configured API (Groq) for generation. Store API keys in environment variables and never commit them to source control.",
  },
  {
    q: "Can I integrate other tools?",
    a: "This repository exposes a JSON API you can call from your own stack. Extend the Python tools to connect CRM, analytics, or project systems.",
  },
  {
    q: "Is there a free tier?",
    a: "Running the app yourself is limited only by your Groq usage. Groq offers a generous free tier for API access.",
  },
  {
    q: "How does this save time?",
    a: "Instead of manually sequencing work, you get a proposed timeline with dependencies and flagged issues in one run.",
  },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <div className="relative bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="pointer-events-none fixed inset-0 bg-hero-glow opacity-90 dark:opacity-100" />
      <div className="pointer-events-none fixed inset-0 bg-grid" />

      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/25">
              <Bot className="h-5 w-5" />
            </span>
            <span>Marketing Planner</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href="#planner"
              className="hidden rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/20 sm:inline-flex"
            >
              Try for free
            </a>
            <button
              type="button"
              className="rounded-lg border border-zinc-200 p-2 md:hidden dark:border-white/10"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-zinc-200 px-4 py-4 dark:border-white/10 md:hidden">
            <nav className="flex flex-col gap-3">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#planner"
                className="rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Try for free
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
              <Zap className="h-3.5 w-3.5" />
              Introducing AI marketing execution plans
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-gradient">Meet your AI planner.</span>
              <br />
              <span className="text-zinc-900 dark:text-white">Streamline your workflow</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              An assistant that turns a single marketing goal into validated tasks, budgets, and a
              timeline—so you focus on strategy, not spreadsheet surgery.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#planner"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25"
              >
                Try for free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how"
                className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              >
                Log in
              </a>
            </div>
          </div>

          <p className="mt-16 text-center text-sm text-zinc-500">Trusted by fast-growing teams</p>
          <div className="relative mt-6 overflow-hidden">
            <div className="flex w-max animate-marquee gap-12 pr-12">
              {[...logos, ...logos].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="planner" className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Plan a campaign in one prompt
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Describe your goal—get a schedule with costs, owners, and ordering.
            </p>
          </div>
          <PlannerPanel />
        </section>

        <section id="features" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Empower your workflow with AI
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
              Ask for real-time task breakdowns, constraint checks, and an actionable schedule.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-white/10 dark:bg-black/30">
                <p className="text-zinc-500 dark:text-zinc-400">Assistant</p>
                <p className="mt-2 text-zinc-800 dark:text-zinc-200">
                  Hey—I need to launch a two-week email nurture. Can you sequence tasks and flag
                  conflicts?
                </p>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Structured planning</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Tasks arrive with estimates and validation signals—not vague bullet lists.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Budget & timeline checks",
                  body: "Mock validators simulate approvals before you commit.",
                  icon: Layers,
                },
                {
                  title: "Team-aware routing",
                  body: "Roles are attached so ownership is obvious downstream.",
                  icon: Users,
                },
                {
                  title: "Ordered execution",
                  body: "Dependencies surface as you build the critical path.",
                  icon: ArrowRight,
                },
                {
                  title: "Fast iteration",
                  body: "Regenerate when goals shift—keep the same UI and API.",
                  icon: Zap,
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <f.icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Simple. Seamless. Smart.
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Four steps from a sentence to a plan you can execute.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Describe your marketing goal in natural language.",
              "The model proposes tasks with cost, timing, and roles.",
              "Validators flag budget, people, or schedule issues.",
              "You get an ordered timeline ready to share or export.",
            ].map((text, i) => (
              <li
                key={text}
                className="relative rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <span className="text-4xl font-bold text-sky-500/40">{i + 1}</span>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-white p-8 dark:border-white/10 dark:from-zinc-900 dark:to-zinc-950 md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Built for secure growth
                </h2>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                  Keep keys in environment variables and run the API close to your data when you
                  extend the tool layer.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-white/10 dark:bg-black/30">
                  <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="mt-2 font-semibold">Sensible defaults</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Validation catches obvious issues before they hit your calendar.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-white/10 dark:bg-black/30">
                  <Layers className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  <h3 className="mt-2 font-semibold">Scales with your team</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Multiple roles per task map cleanly to handoffs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Pricing that scales with you
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              This UI is a starting point—swap in your real plans when you connect billing.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                sub: "Perfect to try the planner",
                cta: "Start free",
                featured: false,
              },
              {
                name: "Startup",
                price: "$12",
                sub: "Ideal for small teams",
                cta: "Upgrade to Pro",
                featured: true,
              },
              {
                name: "Enterprise",
                price: "$24",
                sub: "Best for larger orgs",
                cta: "Contact sales",
                featured: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={clsx(
                  "relative flex flex-col rounded-2xl border p-6",
                  tier.featured
                    ? "border-sky-500/50 bg-gradient-to-b from-sky-500/10 to-transparent shadow-lg shadow-sky-500/10 dark:from-sky-500/15"
                    : "border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-500 px-3 py-0.5 text-xs font-semibold text-white">
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-zinc-500">/month</span>
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{tier.sub}</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• API access</li>
                  <li>• Execution timeline</li>
                  <li>• Validation tools</li>
                </ul>
                <a
                  href="#planner"
                  className={clsx(
                    "mt-6 inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold",
                    tier.featured
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                      : "border border-zinc-300 dark:border-white/15"
                  )}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden py-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-50 to-transparent dark:from-zinc-950" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-50 to-transparent dark:from-zinc-950" />
          <p className="text-center text-sm font-medium text-zinc-500">Loved by operators</p>
          <div className="mt-6 overflow-hidden">
            <div className="flex w-max animate-marquee gap-8 pr-8">
              {[...testimonials, ...testimonials].map((t, i) => (
                <figure
                  key={`${t.name}-${i}`}
                  className="w-80 shrink-0 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <blockquote className="text-sm text-zinc-600 dark:text-zinc-400">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold">{t.name}</figcaption>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Answers about the planner. Reach out if you need more.
            </p>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-zinc-200 bg-white open:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium">
                  {item.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-zinc-400 transition group-open:rotate-180" />
                </summary>
                <p className="border-t border-zinc-100 px-5 pb-4 pt-0 text-sm leading-relaxed text-zinc-600 dark:border-white/5 dark:text-zinc-400">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-600/20 via-cyan-600/10 to-emerald-600/10 p-10 text-center dark:from-sky-900/40">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Automate. Simplify. Thrive.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-300">
              Start with a goal—leave with a plan your team can run.
            </p>
            <a
              href="#planner"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-sky-700 shadow-lg dark:text-sky-900"
            >
              Open the planner
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-12 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
              <Bot className="h-4 w-4" />
            </span>
            Marketing Planner
          </div>
          <p className="text-center text-sm text-zinc-500">
            UI inspired by{" "}
            <a
              href="https://agent-magicui.vercel.app/"
              className="text-sky-600 underline-offset-4 hover:underline dark:text-sky-400"
              target="_blank"
              rel="noreferrer"
            >
              SkyAgent
            </a>{" "}
            — open source layout, local agent.
          </p>
        </div>
      </footer>
    </div>
  );
}
