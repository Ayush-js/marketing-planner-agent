import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { Bot, Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react";
import clsx from "clsx";

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function getFirebaseError(code: string): string {
    switch (code) {
      case "auth/email-already-in-use": return "An account with this email already exists.";
      case "auth/invalid-email": return "Please enter a valid email address.";
      case "auth/weak-password": return "Password must be at least 6 characters.";
      case "auth/user-not-found": return "No account found with this email.";
      case "auth/wrong-password": return "Incorrect password. Please try again.";
      case "auth/invalid-credential": return "Incorrect email or password.";
      case "auth/popup-closed-by-user": return "Sign in was cancelled.";
      case "auth/account-exists-with-different-credential": return "An account already exists with this email using a different sign-in method.";
      default: return "Something went wrong. Please try again.";
    }
  }

  async function handleProviderSignIn(provider: "google" | "github") {
    setError(null);
    if (provider === "google") setGoogleLoading(true);
    else setGithubLoading(true);

    try {
      const selectedProvider = provider === "google" ? googleProvider : githubProvider;
      const result = await signInWithPopup(auth, selectedProvider);
      const user = result.user;
      localStorage.setItem("auth_user", user.email || user.displayName || "user");
      localStorage.setItem("auth_photo", user.photoURL || "");
      localStorage.setItem("auth_name", user.displayName || "");
      navigate("/planner");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(getFirebaseError(code));
    } finally {
      if (provider === "google") setGoogleLoading(false);
      else setGithubLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem("auth_user", result.user.email || email);
        localStorage.setItem("auth_photo", "");
        localStorage.setItem("auth_name", "");
        navigate("/planner");
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("auth_user", result.user.email || email);
        localStorage.setItem("auth_photo", "");
        localStorage.setItem("auth_name", "");
        navigate("/planner");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(getFirebaseError(code));
    } finally {
      setLoading(false);
    }
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

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => handleProviderSignIn("google")}
              disabled={googleLoading || githubLoading}
              className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            {/* GitHub Sign In */}
            <button
              type="button"
              onClick={() => handleProviderSignIn("github")}
              disabled={googleLoading || githubLoading}
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {githubLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              )}
              {githubLoading ? "Signing in..." : "Continue with GitHub"}
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
              <span className="text-xs text-zinc-400">or</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
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
                  {mode === "login" ? "Signing in..." : "Creating account..."}</>
                ) : (
                  mode === "login" ? "Sign in" : "Create account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}