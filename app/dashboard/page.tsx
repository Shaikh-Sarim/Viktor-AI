"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  FileText,
  LogOut,
  Zap,
  MessageCircle,
  Code2,
  Settings,
  CreditCard,
} from "lucide-react";
import { signOut } from "next-auth/react";
import ContentGenerator from "@/components/ContentGenerator";
import ChatComponent from "@/components/ChatComponent";
import CodeGeneratorComponent from "@/components/CodeGeneratorComponent";

type Tab = "content" | "chat" | "code";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [credits, setCredits] = useState(100);
  const [hasValidSubscription, setHasValidSubscription] = useState<boolean | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user has a valid subscription
  useEffect(() => {
    if (session?.user?.id) {
      const checkSubscription = async () => {
        try {
          const response = await fetch("/api/user-subscription");
          if (response.ok) {
            const data = await response.json();
            setHasValidSubscription(data.hasSubscription);
            if (!data.hasSubscription) {
              // Redirect to plan selection if no subscription
              router.push("/choose-plan?reason=subscription_required");
            }
          } else {
            setHasValidSubscription(false);
            router.push("/choose-plan?reason=subscription_required");
          }
        } catch (error) {
          console.error("Failed to check subscription:", error);
          setHasValidSubscription(false);
        }
      };
      checkSubscription();
    }
  }, [session?.user?.id, router]);

  useEffect(() => {
    if (session?.user?.id && hasValidSubscription) {
      const fetchCredits = async () => {
        try {
          const response = await fetch("/api/user-credits");
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits);
          }
        } catch (error) {
          console.error("Failed to fetch credits:", error);
        }
      };
      fetchCredits();
    }
  }, [session?.user?.id, hasValidSubscription]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!isClient || status === "loading" || hasValidSubscription === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "content", label: "Content", icon: <FileText className="w-4 h-4" /> },
    { id: "chat", label: "Chat", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "code", label: "Code", icon: <Code2 className="w-4 h-4" /> },
  ];

  const creditCosts: Record<Tab, number> = {
    content: 10,
    chat: 5,
    code: 8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10">
        <nav className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 sm:p-2.5 rounded-lg shadow-lg shadow-cyan-500/50 flex-shrink-0">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent truncate">Viktor AI</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 backdrop-blur transition-all duration-300 text-xs sm:text-sm ${credits <= 0 ? "bg-red-900/30 border border-red-600/50" : credits <= 10 ? "bg-yellow-900/30 border border-yellow-600/50" : "bg-cyan-500/10 border border-cyan-500/50"}`}>
                <Zap className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${credits <= 0 ? "text-red-500" : credits <= 10 ? "text-yellow-500" : "text-cyan-400"}`} />
                <span className={`font-bold text-xs sm:text-sm ${credits <= 0 ? "text-red-300" : credits <= 10 ? "text-yellow-300" : "text-cyan-300"}`}>{credits}</span>
              </div>
              
              <a href="/subscription" title="Subscription & Billing" className="hidden sm:flex items-center justify-center px-3 py-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-cyan-400 transition-all duration-300 font-semibold text-sm border border-slate-600 hover:border-cyan-500/50">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              
              <a href="/subscription" title="Subscription & Billing" className="sm:hidden flex items-center justify-center px-2 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-cyan-400 transition-all duration-300 font-semibold text-sm border border-slate-600 hover:border-cyan-500/50">
                <CreditCard className="w-5 h-5" />
              </a>
              
              <button onClick={() => signOut()} className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 font-semibold shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transform hover:scale-105 text-sm">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
              <button onClick={() => signOut()} className="sm:hidden flex items-center gap-1 px-2 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 font-semibold shadow-lg shadow-red-500/50">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {credits <= 0 && (
            <div className="mb-4 sm:mb-8 p-3 sm:p-6 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-600/50 rounded-lg sm:rounded-2xl backdrop-blur">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-red-300 mb-1 sm:mb-2">🎯 Credits Finished!</h3>
                  <p className="text-red-200 text-sm mb-3 sm:mb-0">You have used all your credits. Upgrade your plan to continue.</p>
                </div>
                <a href="/pricing" className="px-4 sm:px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 transform hover:scale-105 text-sm flex-shrink-0">Upgrade</a>
              </div>
            </div>
          )}

          {credits > 0 && credits <= 10 && (
            <div className="mb-4 sm:mb-8 p-3 sm:p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg sm:rounded-xl backdrop-blur">
              <p className="text-yellow-300 text-xs sm:text-sm">⚠️ Running low on credits. <a href="/pricing" className="font-bold hover:underline">Upgrade</a></p>
            </div>
          )}

          <div className="flex gap-2 mb-6 sm:mb-8 border-b border-slate-700/50 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 font-semibold transition-all duration-300 border-b-2 whitespace-nowrap text-xs sm:text-base ${activeTab === tab.id ? "border-cyan-500 text-cyan-400 bg-cyan-500/10" : "border-transparent text-slate-400 hover:text-white hover:border-slate-500/50"}`}>
                {tab.icon}
                {tab.label}
                <span className="ml-0.5 sm:ml-1 text-xs bg-slate-700/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">{creditCosts[tab.id]}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2">
              {activeTab === "content" && <ContentGenerator />}
              {activeTab === "chat" && <ChatComponent />}
              {activeTab === "code" && <CodeGeneratorComponent />}
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-slate-800/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 backdrop-blur border border-slate-700/50">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Welcome, {session?.user?.name || "User"}! 👋</h2>
                <p className="text-slate-300 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">Unlock unlimited AI content generation with your credits.</p>
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <p className="text-slate-400 text-xs sm:text-sm"><span className="font-semibold text-slate-300">Email:</span> <br className="sm:hidden" /><span className="hidden sm:inline"> </span>{session?.user?.email}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 backdrop-blur border border-slate-700/50">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2"><span className="text-lg sm:text-2xl">💡</span><span>Feature Info</span></h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  {activeTab === "content" && <p className="text-slate-300">Generate blog posts, emails, social media content, product descriptions, and landing pages.</p>}
                  {activeTab === "chat" && <p className="text-slate-300">Have conversations with AI for Q&A, brainstorming, and problem-solving.</p>}
                  {activeTab === "code" && <p className="text-slate-300">Generate code snippets in multiple programming languages with clean, documented code.</p>}
                </div>
                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                  <p className="text-purple-300 text-xs font-semibold">💾 Current cost: {creditCosts[activeTab]} credits per generation</p>
                </div>
              </div>

              {/* Subscription Management Card */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg sm:rounded-2xl p-4 sm:p-6 backdrop-blur border border-cyan-500/50 hover:border-cyan-500/70 transition-all duration-300">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-cyan-400" /><span>Plan & Billing</span></h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-1">Current Plan</p>
                    <p className="text-cyan-300 font-bold text-sm sm:text-base">Premium Access Active</p>
                  </div>
                  <a href="/subscription" className="block w-full py-2 px-3 sm:px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 text-center text-sm">
                    Manage Subscription
                  </a>
                  <a href="/upgrade-plan" className="block w-full py-2 px-3 sm:px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300 text-center text-sm">
                    View Plans
                  </a>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 backdrop-blur border border-slate-700/50">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2"><Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /><span>Credit Costs</span></h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-300 pb-2 sm:pb-3 border-b border-slate-700/50"><span>📄 Content</span><span className="font-bold text-cyan-400">10</span></div>
                  <div className="flex justify-between items-center text-slate-300 pb-2 sm:pb-3 border-b border-slate-700/50"><span>💬 Chat</span><span className="font-bold text-cyan-400">5</span></div>
                  <div className="flex justify-between items-center text-slate-300"><span>💻 Code</span><span className="font-bold text-cyan-400">8</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
