"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever",
    description: "Perfect for trying out our platform",
    credits: 100,
    features: [
      "100 credits/month",
      "Chat with Groq LLM",
      "Web search integration",
      "Content generation",
      "Code generation",
      "Community support",
      "Basic analytics",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Basic",
    price: "$9",
    period: "/month",
    description: "For hobbyists and small projects",
    credits: 500,
    features: [
      "500 credits/month",
      "Everything in Free, plus:",
      "Priority chat support",
      "Advanced analytics",
      "Custom prompts",
      "Batch processing",
      "API access (limited)",
    ],
    cta: "Choose Basic",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals and teams",
    credits: 2000,
    features: [
      "2,000 credits/month",
      "Everything in Basic, plus:",
      "Full API access",
      "Unlimited batch processing",
      "Priority email support",
      "Advanced features",
      "Usage analytics & reports",
    ],
    cta: "Choose Pro",
    highlighted: true,
  },
  {
    name: "Pro+",
    price: "$79",
    period: "/month",
    description: "For power users and agencies",
    credits: 10000,
    features: [
      "10,000 credits/month",
      "Everything in Pro, plus:",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "Priority phone support",
      "Advanced security features",
    ],
    cta: "Choose Pro+",
    highlighted: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();

  const handleChoosePlan = (planName: string) => {
    if (!session) {
      redirect("/login");
    } else {
      redirect(`/choose-plan?plan=${planName.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 rounded-lg shadow-lg shadow-cyan-500/50">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viktor AI</h1>
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-slate-300 hidden sm:inline">{session.user?.email}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/50 transform hover:scale-105"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-300 hover:text-white transition-colors duration-300 font-medium">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/50 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur">
            <span className="text-sm font-semibold text-cyan-300">Transparent Pricing</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Choose Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Scale as you grow. No credit card required for Free plan. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl transition-all duration-300 transform ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-2 ring-cyan-500/50 shadow-2xl shadow-cyan-500/20 lg:scale-105 hover:scale-110 hover:ring-cyan-400 border border-cyan-500/50"
                    : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70 backdrop-blur"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">⭐ MOST POPULAR</span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name and Price */}
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-white"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.highlighted ? "text-cyan-200" : "text-slate-400"}`}>
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-cyan-400"}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${plan.highlighted ? "text-cyan-200" : "text-slate-400"}`}>
                        {plan.period}
                      </span>
                    </div>
                    <div className={`mt-3 text-sm font-semibold ${plan.highlighted ? "text-cyan-100" : "text-cyan-400"}`}>
                      {plan.credits.toLocaleString()} credits/month
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleChoosePlan(plan.name)}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 mb-8 transform hover:scale-105 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/50"
                        : "bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600/50"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className={`text-lg flex-shrink-0 ${plan.highlighted ? "text-cyan-300" : "text-green-400"}`}>✓</span>
                        <span className={`text-sm leading-relaxed ${plan.highlighted ? "text-cyan-50" : "text-slate-300"}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-y border-slate-700/50 py-24 backdrop-blur">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-4">
                Common Questions
              </h2>
              <p className="text-slate-300">Everything you need to know about our pricing</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Can I change my plan later?",
                  a: "Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately.",
                },
                {
                  q: "What happens when I run out of credits?",
                  a: "We'll notify you when you're running low. You can upgrade your plan or purchase additional credits to continue using the service.",
                },
                {
                  q: "Do unused credits roll over?",
                  a: "No, credits are issued monthly. However, you can upgrade to a higher plan to get access to more credits immediately.",
                },
                {
                  q: "Is there a long-term contract?",
                  a: "No! All plans are month-to-month. You can cancel anytime without any penalties.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur">
                  <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-400 mb-6">
            Questions? Email us at support@viktor-ai.com
          </p>
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
