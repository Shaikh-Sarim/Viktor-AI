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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
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
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!isClient || status === "loading") {
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
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 rounded-lg shadow-lg shadow-cyan-500/50">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viktor AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2.5 rounded-lg flex items-center gap-2 backdrop-blur transition-all duration-300 ${credits <= 0 ? "bg-red-900/30 border border-red-600/50" : credits <= 10 ? "bg-yellow-900/30 border border-yellow-600/50" : "bg-cyan-500/10 border border-cyan-500/50"}`}>
                <Zap className={`w-5 h-5 ${credits <= 0 ? "text-red-500" : credits <= 10 ? "text-yellow-500" : "text-cyan-400"}`} />
                <span className={`font-bold text-sm ${credits <= 0 ? "text-red-300" : credits <= 10 ? "text-yellow-300" : "text-cyan-300"}`}>{credits} Credits</span>
              </div>
              <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 font-semibold shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transform hover:scale-105">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {credits <= 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-600/50 rounded-2xl backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-red-300 mb-2">🎯 Credits Finished!</h3>
                  <p className="text-red-200 mb-4">You have used all your credits. Upgrade your plan to continue.</p>
                </div>
                <a href="/pricing" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 whitespace-nowrap transform hover:scale-105">Upgrade Now</a>
              </div>
            </div>
          )}

          {credits > 0 && credits <= 10 && (
            <div className="mb-8 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-xl backdrop-blur flex items-center justify-between">
              <p className="text-yellow-300">⚠️ Running low on credits. <a href="/pricing" className="font-bold hover:underline">Upgrade</a></p>
            </div>
          )}

          <div className="flex gap-2 mb-8 border-b border-slate-700/50 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${activeTab === tab.id ? "border-cyan-500 text-cyan-400 bg-cyan-500/10" : "border-transparent text-slate-400 hover:text-white hover:border-slate-500/50"}`}>
                {tab.icon}
                {tab.label}
                <span className="ml-1 text-xs bg-slate-700/50 px-2 py-1 rounded-full">{creditCosts[tab.id]} credits</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === "content" && <ContentGenerator />}
              {activeTab === "chat" && <ChatComponent />}
              {activeTab === "code" && <CodeGeneratorComponent />}
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur border border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-4">Welcome, {session?.user?.name || "User"}! 👋</h2>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">Unlock unlimited AI content generation with your credits.</p>
                <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <p className="text-slate-400 text-sm"><span className="font-semibold text-slate-300">Email:</span> <br/>{session?.user?.email}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="text-2xl">💡</span>Feature Info</h3>
                <div className="space-y-3 text-sm">
                  {activeTab === "content" && <p className="text-slate-300">Generate blog posts, emails, social media content, product descriptions, and landing pages.</p>}
                  {activeTab === "chat" && <p className="text-slate-300">Have conversations with AI for Q&A, brainstorming, and problem-solving.</p>}
                  {activeTab === "code" && <p className="text-slate-300">Generate code snippets in multiple programming languages with clean, documented code.</p>}
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                  <p className="text-purple-300 text-xs font-semibold">💾 Current cost: {creditCosts[activeTab]} credits per generation</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />Credit Costs</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-slate-300 pb-3 border-b border-slate-700/50"><span>📄 Content Generation</span><span className="font-bold text-cyan-400">10</span></div>
                  <div className="flex justify-between items-center text-slate-300 pb-3 border-b border-slate-700/50"><span>💬 Chat Messages</span><span className="font-bold text-cyan-400">5</span></div>
                  <div className="flex justify-between items-center text-slate-300"><span>💻 Code Generation</span><span className="font-bold text-cyan-400">8</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
