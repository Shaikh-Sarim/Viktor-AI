"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Brain, ChevronLeft, Zap, Calendar, RotateCw, Trash2, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SubscriptionData {
  plan: string;
  credits: number;
  createdAt: string;
  isPaidPlan: boolean;
  orderId?: string;
}

const PLAN_DETAILS: Record<string, { name: string; price: number; credits: number; color: string }> = {
  free: { name: "Free", price: 0, credits: 100, color: "from-slate-500 to-slate-600" },
  basic: { name: "Basic", price: 9.99, credits: 500, color: "from-blue-500 to-cyan-500" },
  pro: { name: "Pro", price: 29.99, credits: 2000, color: "from-cyan-500 to-blue-500" },
  pro_plus: { name: "Pro+", price: 79.99, credits: 10000, color: "from-purple-500 to-pink-500" },
};

const UPGRADE_PATHS: Record<string, string[]> = {
  free: ["basic", "pro", "pro_plus"],
  basic: ["pro", "pro_plus"],
  pro: ["pro_plus"],
  pro_plus: [],
};

export default function SubscriptionManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

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
        setSubscription(data);
      }
    } catch (err) {
      setError("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = async (newPlan: string) => {
    try {
      const response = await fetch("/api/paypal-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });

      const data = await response.json();
      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        setError("Failed to initiate payment");
      }
    } catch (err) {
      setError("Payment initiation failed");
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch("/api/subscription-cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setShowCancelModal(false);
        fetchSubscription();
      } else {
        setError("Failed to cancel subscription");
      }
    } catch (err) {
      setError("Cancellation failed");
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isClient || status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || !subscription) {
    return null;
  }

  const currentPlanDetails = PLAN_DETAILS[subscription.plan];
  const upgradePlans = UPGRADE_PATHS[subscription.plan] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <nav className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-300 font-semibold">Back to Dashboard</span>
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
        <div className="max-w-6xl mx-auto px-4 py-12">
          {error && (
            <div className="mb-8 p-4 bg-red-900/30 border border-red-600/50 rounded-lg backdrop-blur flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-300">Error</h3>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Current Plan Card */}
          <div className="mb-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur hover:bg-slate-800/70 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan Info */}
              <div>
                <p className="text-slate-400 text-sm mb-2">Current Plan</p>
                <div className={`bg-gradient-to-r ${currentPlanDetails.color} p-0.5 rounded-xl inline-block`}>
                  <div className="bg-slate-900 px-6 py-3 rounded-[10px]">
                    <h2 className="text-2xl font-bold text-white">{currentPlanDetails.name}</h2>
                  </div>
                </div>
                {subscription.plan !== "free" && (
                  <p className="text-cyan-400 font-bold text-3xl mt-4">${currentPlanDetails.price}<span className="text-lg text-slate-400">/mo</span></p>
                )}
              </div>

              {/* Credits Info */}
              <div>
                <p className="text-slate-400 text-sm mb-2">Monthly Allocation</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-cyan-500/20 p-3 rounded-lg">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{subscription.credits}</p>
                    <p className="text-slate-400 text-sm">credits/month</p>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div>
                <p className="text-slate-400 text-sm mb-2">Status</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-semibold">Active</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Subscribed on {new Date(subscription.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-slate-700/50 flex flex-wrap gap-4">
              {upgradePlans.length > 0 && (
                <button
                  onClick={() => router.push("/upgrade-plan")}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105 flex items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Upgrade Plan
                </button>
              )}
              {subscription.plan !== "free" && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-300 font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>

          {/* Upgrade Options */}
          {upgradePlans.length > 0 && (
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-white mb-8">Available Upgrades</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upgradePlans.map((planId) => {
                  const plan = PLAN_DETAILS[planId];
                  if (!plan) return null;

                  return (
                    <div
                      key={planId}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 group"
                    >
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                        <p className="text-4xl font-bold text-cyan-400">
                          ${plan.price}<span className="text-lg text-slate-400">/mo</span>
                        </p>
                      </div>

                      <div className="mb-6 pb-6 border-b border-slate-700/50 space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-slate-300">{plan.credits} credits/month</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-slate-300">Full feature access</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-slate-300">Priority support</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpgradePlan(planId)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 group-hover:scale-105"
                      >
                        Upgrade to {plan.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Renewal Info */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyan-500/20 p-3 rounded-lg">
                  <RotateCw className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="text-xl font-bold text-white">Auto-Renewal</h4>
              </div>
              <p className="text-slate-400 mb-4">
                {subscription.plan === "free"
                  ? "Free plan renews monthly with 100 credits"
                  : "Your paid plan automatically renews every month. You'll be billed on the same date each month."}
              </p>
              <p className="text-sm text-slate-500">Next renewal: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</p>
            </div>

            {/* Cancellation Info */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-500/20 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-xl font-bold text-white">Cancellation Policy</h4>
              </div>
              <p className="text-slate-400 mb-4">
                You can cancel your subscription anytime. Your access will continue until the end of your current billing period.
              </p>
              <p className="text-sm text-slate-500">No refunds for partial months.</p>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur">
            <h3 className="text-2xl font-bold text-white mb-8">All Plans Include</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Advanced AI Content Generation",
                "Live Web Search Integration",
                "Code Generation & Debugging",
                "Interactive Chat with AI",
                "Secure Data Encryption",
                "Priority Customer Support",
                "API Access (Pro plans)",
                "Advanced Analytics (Pro+)",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Cancel Subscription?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to cancel your {currentPlanDetails.name} subscription? Your access will continue until the end of your current billing period.
            </p>

            <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-6">
              <p className="text-amber-200 text-sm">
                <span className="font-bold">Note:</span> You can resubscribe anytime. No cancellation fees.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300"
              >
                {cancelLoading ? "Canceling..." : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
