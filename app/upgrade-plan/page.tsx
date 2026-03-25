"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Brain, ChevronLeft, CheckCircle, Zap, TrendingUp, Code2, Shield, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Subscription {
  plan: string;
  credits: number;
}

export default function UpgradePlan() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscription();
    }
  }, [session?.user?.id]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user-subscription");
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setUpgradeLoading(planId);
    try {
      const response = await fetch("/api/paypal-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();
      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setUpgradeLoading(null);
    }
  };

  if (!isClient || status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "Forever",
      credits: 100,
      description: "Perfect for getting started",
      features: [
        "100 credits/month",
        "Chat with AI",
        "Web search",
        "Content generation",
        "Community support",
      ],
      color: "from-slate-500 to-slate-600",
    },
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "/month",
      credits: 500,
      description: "Great for hobbyists",
      features: [
        "500 credits/month",
        "Everything in Free",
        "Priority support",
        "API access",
        "Custom prompts",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29.99",
      period: "/month",
      credits: 2000,
      description: "Most popular for professionals",
      popular: true,
      features: [
        "2,000 credits/month",
        "Everything in Basic",
        "Full API access",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
      ],
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "pro_plus",
      name: "Pro+",
      price: "$79.99",
      period: "/month",
      credits: 10000,
      description: "For power users & teams",
      features: [
        "10,000 credits/month",
        "Everything in Pro",
        "Dedicated support",
        "White-label options",
        "Team collaboration",
        "Priority processing",
      ],
      color: "from-purple-500 to-pink-500",
    },
  ];

  const toolFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Get results in milliseconds",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure",
      description: "Enterprise-grade encryption",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Scalable",
      description: "Grow at your pace",
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Code Gen",
      description: "Multiple language support",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Learn More",
      description: "AI Chat support",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Premium",
      description: "Advanced features",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <nav className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/subscription" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-300 font-semibold">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 rounded-lg shadow-lg shadow-cyan-500/50">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viktor AI</h1>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-4 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur">
              <span className="text-sm font-semibold text-cyan-300">💰 Upgrade Your Plan</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Choose Your Perfect Plan</h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto">
              Unlock advanced features and boost your productivity with more credits and powerful tools
            </p>
          </div>

          {/* Current Plan Badge */}
          {currentPlan && (
            <div className="mb-12 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg backdrop-blur text-center">
              <p className="text-cyan-300">
                You're currently on the <span className="font-bold">{currentPlan.plan.charAt(0).toUpperCase() + currentPlan.plan.slice(1)}</span> plan with <span className="font-bold">{currentPlan.credits}</span> credits/month
              </p>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {plans.map((plan) => {
              const isCurrent = currentPlan?.plan === plan.id;
              const canUpgrade = currentPlan && ["free", "basic", "pro"].includes(currentPlan.plan) && 
                                ["basic", "pro", "pro_plus"].includes(plan.id) &&
                                ["basic", "pro", "pro_plus"].indexOf(plan.id) > ["free", "basic", "pro"].indexOf(currentPlan.plan);

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 backdrop-blur transition-all duration-300 group ${
                    plan.popular
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 lg:scale-105 hover:scale-110 shadow-2xl shadow-cyan-500/20"
                      : "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 hover:border-cyan-500/50"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-full">
                      ⭐ MOST POPULAR
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Current
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-white"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.popular ? "text-cyan-200" : "text-slate-400"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-cyan-400"}`}>
                      {plan.price}
                      <span className={`text-lg ${plan.popular ? "text-cyan-200" : "text-slate-400"}`}>
                        {plan.period}
                      </span>
                    </p>
                    <p className={`text-sm mt-2 ${plan.popular ? "text-cyan-200" : "text-slate-400"}`}>
                      {plan.credits} credits/month
                    </p>
                  </div>

                  <div className="mb-8 pb-8 border-b border-slate-700/50 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-white" : "text-green-400"}`} />
                        <span className={`text-sm ${plan.popular ? "text-cyan-50" : "text-slate-300"}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {isCurrent ? (
                    <div className="w-full py-3 px-4 bg-slate-700/50 text-slate-300 font-bold rounded-lg text-center">
                      Current Plan
                    </div>
                  ) : canUpgrade ? (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgradeLoading === plan.id}
                      className={`w-full py-3 px-4 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 group-hover:scale-105"
                          : "bg-slate-700 hover:bg-slate-600 text-white"
                      } disabled:opacity-50`}
                    >
                      <TrendingUp className="w-5 h-5" />
                      {upgradeLoading === plan.id ? "Processing..." : "Upgrade"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgradeLoading === plan.id}
                      className={`w-full py-3 px-4 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 group-hover:scale-105"
                          : "bg-slate-700 hover:bg-slate-600 text-white"
                      } disabled:opacity-50`}
                    >
                      <TrendingUp className="w-5 h-5" />
                      {upgradeLoading === plan.id ? "Processing..." : "Choose"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">All Plans Include</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolFeatures.map((feature, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 group">
                  <div className="bg-cyan-500/20 p-3 rounded-lg w-fit mb-4 group-hover:bg-cyan-500/30 transition-colors">
                    <div className="text-cyan-400">{feature.icon}</div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur">
            <h3 className="text-2xl font-bold text-white mb-8">FAQ</h3>
            <div className="space-y-6">
              {[
                {
                  q: "Can I change plans?",
                  a: "Yes! You can upgrade anytime. Downgrades apply at the end of your billing cycle.",
                },
                {
                  q: "What happens if I run out of credits?",
                  a: "You can upgrade your plan or wait for your monthly reset. Free tier users get 100 credits monthly.",
                },
                {
                  q: "Is there a long-term contract?",
                  a: "No! All plans are month-to-month. Cancel anytime without penalties.",
                },
                {
                  q: "Do unused credits roll over?",
                  a: "No, credits reset monthly. This ensures fair usage for all users.",
                },
              ].map((faq, i) => (
                <div key={i}>
                  <h4 className="font-bold text-white mb-2">{faq.q}</h4>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <p className="text-slate-400 mb-4">
              Need more information? Contact our support team
            </p>
            <Link
              href="/dashboard"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Back to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
