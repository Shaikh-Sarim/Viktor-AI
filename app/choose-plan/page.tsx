"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useState, Suspense } from "react";
import { Brain, Zap } from "lucide-react";
import axios from "axios";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    credits: 100,
    description: "Start with free credits",
    features: [
      "100 credits/month",
      "Chat with AI",
      "Web search",
      "Content generation",
      "Community support",
    ],
    recommended: false,
    isPaid: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: "$9",
    credits: 500,
    description: "For regular users",
    features: [
      "500 credits/month",
      "Everything in Free",
      "Priority support",
      "API access",
      "Custom prompts",
    ],
    recommended: false,
    isPaid: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    credits: 2000,
    description: "Most popular",
    features: [
      "2,000 credits/month",
      "Everything in Basic",
      "Full API access",
      "Advanced analytics",
      "Priority support",
    ],
    recommended: true,
    isPaid: true,
  },
  {
    id: "pro_plus",
    name: "Pro+",
    price: "$79",
    credits: 10000,
    description: "For power users",
    features: [
      "10,000 credits/month",
      "Everything in Pro",
      "Dedicated support",
      "White-label options",
      "Custom integrations",
    ],
    recommended: false,
    isPaid: true,
  },
];

function ChoosePlanContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);

  if (!session) {
    redirect("/login");
  }

  const selectedPlanObj = plans.find(p => p.id === selectedPlan);

  const handleSelectPlan = async () => {
    setLoading(true);
    try {
      // Free plan: directly create subscription
      if (!selectedPlanObj?.isPaid) {
        const response = await axios.post("/api/select-plan", {
          plan: selectedPlan,
        });

        if (response.status === 200) {
          router.push("/dashboard");
        }
      } else {
        // Paid plan: try PayPal first, fallback to test mode
        const response = await axios.post("/api/paypal-create-order", {
          plan: selectedPlan,
        });

        if (response.data?.testMode) {
          // Test mode: no PayPal configured, subscription created directly
          router.push("/dashboard");
        } else if (response.data?.approvalUrl) {
          // PayPal configured: redirect to PayPal checkout
          window.location.href = response.data.approvalUrl;
        }
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      alert("Failed to select plan. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex items-center gap-2 md:gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-lg">
              <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Viktor AI
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-20">
          {/* Title */}
          <div className="text-center mb-12 md:mb-20">
            <div className="mb-3 md:mb-4 inline-block px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur">
              <span className="text-xs md:text-sm font-semibold text-cyan-300">Choose Your Plan</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Welcome to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viktor AI</span>! 🚀
            </h2>
            <p className="text-sm md:text-lg text-slate-300 mb-2 md:mb-3 break-words">
              Hello, <span className="font-semibold text-cyan-300 inline-block max-w-full truncate">{session.user?.email}</span>
            </p>
            <p className="text-slate-400 text-xs md:text-lg">
              Select your plan to unlock AI-powered content generation
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer rounded-2xl transition-all duration-300 transform p-5 md:p-8 relative group ${
                  selectedPlan === plan.id
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)] scale-105"
                    : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-500/50 hover:bg-slate-800/70 hover:scale-102 backdrop-blur"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                      ⭐ POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-5 md:mb-8">
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">
                    {plan.name}
                  </h3>
                  <p className={`text-xs md:text-sm ${selectedPlan === plan.id ? "text-cyan-200" : "text-slate-400"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-5 md:mb-8 pb-4 md:pb-6 border-b border-slate-700/50">
                  <div className="flex items-baseline gap-2 mb-2 md:mb-3">
                    <span className={`text-3xl md:text-4xl font-bold ${selectedPlan === plan.id ? "text-white" : "text-cyan-400"}`}>
                      {plan.price}
                    </span>
                    {plan.price !== "$0" && (
                      <span className={`text-xs md:text-sm ${selectedPlan === plan.id ? "text-cyan-200" : "text-slate-400"}`}>
                        /mo
                      </span>
                    )}
                  </div>
                  <div className={`text-xs md:text-sm font-semibold ${selectedPlan === plan.id ? "text-cyan-100" : "text-cyan-400"}`}>
                    {plan.credits.toLocaleString()} credits
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 md:gap-3">
                      <div className={`w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0 rounded-full flex items-center justify-center ${selectedPlan === plan.id ? "bg-cyan-400" : "bg-green-500"}`}>
                        <span className="text-xs font-bold text-slate-900">✓</span>
                      </div>
                      <span className={`text-xs md:text-sm leading-relaxed ${selectedPlan === plan.id ? "text-cyan-50" : "text-slate-300"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedPlan === plan.id && (
                  <div className="absolute top-8 right-8">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center animate-pulse">
                      <span className="text-lg font-bold text-white">✓</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-5 md:p-8 mb-8 md:mb-12 backdrop-blur">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">
                  Flexible Plan Management
                </h3>
                <p className="text-xs md:text-slate-300">
                  Upgrade, downgrade, or cancel your plan anytime. Changes take effect immediately.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center px-2">
            <button
              onClick={handleSelectPlan}
              disabled={loading}
              className="px-6 md:px-12 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl text-sm md:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] transform hover:scale-105 w-full md:w-auto"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs md:text-base">Setting up...</span>
                </span>
              ) : (
                <span className="text-xs md:text-base">{`${selectedPlanObj?.isPaid ? "Proceed to Payment" : "Start Free"} • ${selectedPlanObj?.name}`}</span>
              )}
            </button>
            <p className="text-slate-400 text-xs md:text-sm mt-4 md:mt-6">
              {selectedPlanObj?.isPaid ? "Secure PayPal checkout • No auto-renewal" : "No credit card required • Cancel anytime"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChoosePlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <ChoosePlanContent />
    </Suspense>
  );
}
