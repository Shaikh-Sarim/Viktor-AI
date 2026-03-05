"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { redirect, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Brain, Loader } from "lucide-react";
import { useEffect } from "react";

const PLAN_DETAILS: Record<string, { name: string; price: number; credits: number }> = {
  basic: { name: "Basic", price: 9, credits: 500 },
  pro: { name: "Pro", price: 29, credits: 2000 },
  pro_plus: { name: "Pro+", price: 79, credits: 10000 },
};

function PaymentContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get plan from URL
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get("plan");
    if (planParam && PLAN_DETAILS[planParam]) {
      setPlan(planParam);
    } else {
      redirect("/choose-plan");
    }
  }, []);

  if (!session) {
    redirect("/login");
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const planDetails = PLAN_DETAILS[plan];

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      // For now, simulate successful payment and proceed
      // In production, this would integrate with PayPal API
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan,
          amount: planDetails.price,
          email: session.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      // On success, redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSkipPayment = async () => {
    // Process the plan selection without PayPal
    setLoading(true);
    try {
      const response = await fetch("/api/select-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Failed to process plan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Viktor AI
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="mb-4 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur">
              <span className="text-sm font-semibold text-cyan-300">Final Step</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Complete Your Purchase
            </h2>
            <p className="text-lg text-slate-300">
              Choose how to proceed with your <span className="font-semibold text-cyan-300">{planDetails.name} Plan</span> • <span className="font-semibold text-cyan-300">${planDetails.price}/month</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Summary */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur">
                <h3 className="text-2xl font-bold text-white mb-8">Order Summary</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center text-slate-300 pb-4 border-b border-slate-700/50">
                    <span className="text-lg">{planDetails.name} Plan (Monthly)</span>
                    <span className="font-bold text-xl text-white">${planDetails.price}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-lg">Monthly Credits Included</span>
                    <span className="font-bold text-cyan-400">{planDetails.credits.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 mb-8 border border-cyan-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Due Today</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">${planDetails.price}.00</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    🔁 Renew automatically monthly • 💳 PayPal secure payment • ✋ Cancel anytime free
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-xl flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🔒</span>
                        Pay with PayPal
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSkipPayment}
                    disabled={loading}
                    className="w-full py-4 px-4 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50"
                  >
                    {loading ? "Processing..." : "Continue to Dashboard →"}
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-cyan-400 font-bold mb-1">🔒</div>
                      <p className="text-slate-400">Secure</p>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold mb-1">⚡</div>
                      <p className="text-slate-400">Instant</p>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold mb-1">✋</div>
                      <p className="text-slate-400">Cancelable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/30 backdrop-blur h-fit">
              <h3 className="text-xl font-bold text-white mb-6">Welcome to Viktor AI</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-2 flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{planDetails.credits.toLocaleString()} Credits</p>
                    <p className="text-sm text-slate-400">Monthly AI generation allowance</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-2 flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">All AI Features</p>
                    <p className="text-sm text-slate-400">Chat, content generation & more</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-2 flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Priority Support</p>
                    <p className="text-sm text-slate-400">Get help when you need it</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-2 flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Cancel Anytime</p>
                    <p className="text-sm text-slate-400">No lock-in commitment</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-8 border-t border-blue-500/20">
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  Your subscription renews every month. You can upgrade, downgrade, or cancel anytime without penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <PaymentContent />
    </Suspense>
  );
}
