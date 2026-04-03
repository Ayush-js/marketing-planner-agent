import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react";
import clsx from "clsx";

const MOCK_USERS: Record<string, string> = {
  "demo@planner.ai": "password123",
  "ayush@planner.ai": "ayush123",
};

interface LoginPageProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export function LoginPage({ theme, toggleTheme }: LoginPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    setTimeout(() => {
      if (mode === "login") {
        const stored = MOCK_USERS[email.toLowerCase()];
        if (!stored) {
          setError("No account found with this email.");
        } else if (stored !== password) {
          setError("Incorrect password. Please try again.");
        } else {
          localStorage.setItem("auth_user", email);
          navigate("/planner");
        }
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
        } else if (password.length < 6) {
          setError("Password must be at least 6 characters.");
        } else if (!email.includes("@")) {
          setError("Please enter a valid email address.");
        } else {
          MOCK_USERS[email.toLowerCase()] = password;
          setSuccess("Account created! You can now log in.");
          setMode("login");
          setPassword("");
          setConfirmPassword("");
        }
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="pointer-events-none fixed inset-0 bg-hero-glow opacity-90 dark:opacity-100" />
      <div className="pointer-events-none fixed inset-0 bg-grid" />

      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/25">
            <Bot className="h-5 w-5" />
          </span>
          <span>Marketing Planner</span>
        </a>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mb-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/25">
                <Bot className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-2xl font-bold tracking-tight">
                {mode === "login" ? "Welcome back" : "Create an account"}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {mode === "login"
                  ? "Sign in to access your marketing planner"
                  : "Sign up to get started for free"}
              </p>
            </div>

            <div className="mb-6 flex rounded-xl border border-zinc-200 p-1 dark:border-white/10">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                className={clsx(
                  "flex-1 rounded-lg py-2 text-sm font-medium transition",
                  mode === "login"
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                className={clsx(
                  "flex-1 rounded-lg py-2 text-sm font-medium transition",
                  mode === "signup"
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-black/30 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-black/30 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Confirm password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-black/30 dark:text-zinc-100"
                  />
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:from-sky-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "login" ? "Signing in…" : "Creating account…"}</>
                ) : (
                  mode === "login" ? "Sign in" : "Create account"
                )}
              </button>
            </form>

            {mode === "login" && (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-medium text-zinc-500">Demo credentials</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Email: <span className="font-mono text-sky-600 dark:text-sky-400">demo@planner.ai</span>
                </p>
                <p className="text-xs text-zinc-400">
                  Password: <span className="font-mono text-sky-600 dark:text-sky-400">password123</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}