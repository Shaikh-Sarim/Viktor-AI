"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Brain, Loader } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Check if user already has a subscription/plan selected
        try {
          const subscriptionResponse = await fetch("/api/user-subscription");
          if (subscriptionResponse.ok) {
            const subscription = await subscriptionResponse.json();
            if (subscription?.plan) {
              // User already has a plan, go to dashboard
              router.push("/dashboard");
            } else {
              // No plan yet, ask them to select one
              router.push("/choose-plan");
            }
          } else {
            // Error checking subscription, go to plan selection to be safe
            router.push("/choose-plan");
          }
        } catch {
          // Default to dashboard if check fails
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6 group">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-lg shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-shadow duration-300">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viktor AI</h1>
          </Link>
          <p className="text-slate-300 text-lg">Welcome back</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur">
          {registered && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-600/50 rounded-xl flex items-start gap-3 backdrop-blur">
              <span className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 text-lg font-bold">✓</span>
              <div>
                <h3 className="font-bold text-green-300 mb-1">Account Created!</h3>
                <p className="text-green-200 text-sm">
                  Your account is ready. Login to get started.
                </p>
              </div>
            </div>
          )}

          <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-xl backdrop-blur">
              <p className="text-red-300 text-sm">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:border-cyan-500 focus:bg-slate-700/70 focus:outline-none transition-all duration-300 backdrop-blur"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:border-cyan-500 focus:bg-slate-700/70 focus:outline-none transition-all duration-300 backdrop-blur"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In →
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
