"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Users,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Send,
  Loader,
  Copy,
  Check,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  createdAt: string;
  paymentStatus: "Paid" | "Free";
  subscription: {
    plan: string;
    credits: number;
    createdAt: string;
  } | null;
  chatCount: number;
  documentCount: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Markdown renderer for chat messages
function MarkdownRenderer({ text }: { text: string }) {
  // Parse markdown and convert to React elements
  const parseMarkdown = (md: string) => {
    const elements: React.JSX.Element[] = [];
    let key = 0;

    // Split by code blocks first
    const parts = md.split(/(```[\s\S]*?```)/);

    parts.forEach((part, idx) => {
      if (part.startsWith("```")) {
        // Code block
        const codeContent = part.replace(/```/g, "").trim();
        elements.push(
          <pre
            key={`code-${key++}`}
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 my-2 overflow-x-auto text-sm"
          >
            <code className="text-cyan-300 font-mono">{codeContent}</code>
          </pre>
        );
      } else {
        // Regular text - split by lines for better formatting
        const lines = part.split("\n");
        lines.forEach((line, lineIdx) => {
          if (!line.trim()) {
            elements.push(<div key={`space-${key++}`} className="my-2" />);
            return;
          }

          // Handle bullet points
          if (line.match(/^[-*•]\s/)) {
            elements.push(
              <div key={`bullet-${key++}`} className="ml-4 my-1 flex gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span className="text-gray-100">
                  {parseInlineMarkdown(line.replace(/^[-*•]\s/, ""))}
                </span>
              </div>
            );
          }
          // Handle numbered lists
          else if (line.match(/^\d+\.\s/)) {
            const match = line.match(/^(\d+)\.\s/);
            const num = match ? match[1] : "";
            elements.push(
              <div key={`list-${key++}`} className="ml-4 my-1 flex gap-2">
                <span className="text-cyan-400 flex-shrink-0 font-bold">{num}.</span>
                <span className="text-gray-100">
                  {parseInlineMarkdown(line.replace(/^\d+\.\s/, ""))}
                </span>
              </div>
            );
          }
          // Handle headings
          else if (line.startsWith("##")) {
            elements.push(
              <h3 key={`h3-${key++}`} className="text-lg font-bold text-cyan-300 mt-3 mb-2">
                {parseInlineMarkdown(line.replace(/^#+\s/, ""))}
              </h3>
            );
          } else if (line.startsWith("#")) {
            elements.push(
              <h2 key={`h2-${key++}`} className="text-xl font-bold text-cyan-300 mt-4 mb-2">
                {parseInlineMarkdown(line.replace(/^#+\s/, ""))}
              </h2>
            );
          }
          // Regular paragraph
          else {
            elements.push(
              <p key={`para-${key++}`} className="text-gray-100 my-1">
                {parseInlineMarkdown(line)}
              </p>
            );
          }
        });
      }
    });

    return elements;
  };

  const parseInlineMarkdown = (text: string) => {
    // Handle bold: **text** or __text__
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Handle italic: *text* or _text_
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.+?)_/g, "<em>$1</em>");

    // Handle inline code: `text`
    text = text.replace(/`(.+?)`/g, "<code>$1</code>");

    // Handle links: [text](url)
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

    return (
      <span
        dangerouslySetInnerHTML={{ __html: text }}
        className="inline"
      />
    );
  };

  return <div className="space-y-2">{parseMarkdown(text)}</div>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat">("dashboard");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hello! I'm the Admin Assistant for Viktor AI. I have unlimited access and can help you with platform management, user analysis, testing features, and more. What would you like to do?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          "x-admin-token": token,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
    };

    // Add user message to chat
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      
      // Prepare conversation history for API
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || "",
        },
        body: JSON.stringify({ 
          message: chatInput,
          conversationHistory: conversationHistory
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Unable to process your message.",
      };

      setChatMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setChatMessages([...updatedMessages, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = {
    totalUsers: users.length,
    paidUsers: users.filter((u) => u.paymentStatus === "Paid").length,
    freeUsers: users.filter((u) => u.paymentStatus === "Free").length,
    totalCreditsUsed: users.reduce((sum, u) => sum + (u.subscription?.credits || 0), 0),
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">A</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-white truncate">Admin Dashboard</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Manage your platform</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition text-sm flex-shrink-0"
            title="Logout"
          >
            <LogOut size={16} className="sm:w-18" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
            }`}
          >
            Admin Chat
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-3 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Total Users</p>
                    <p className="text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <Users className="w-7 sm:w-10 h-7 sm:h-10 text-cyan-500 opacity-50 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-3 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Paid Users</p>
                    <p className="text-xl sm:text-3xl font-bold text-green-400 mt-1 sm:mt-2">
                      {stats.paidUsers}
                    </p>
                  </div>
                  <DollarSign className="w-7 sm:w-10 h-7 sm:h-10 text-green-500 opacity-50 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-3 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Free Users</p>
                    <p className="text-xl sm:text-3xl font-bold text-blue-400 mt-1 sm:mt-2">
                      {stats.freeUsers}
                    </p>
                  </div>
                  <TrendingUp className="w-7 sm:w-10 h-7 sm:h-10 text-blue-500 opacity-50 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-3 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Conversion Rate</p>
                    <p className="text-xl sm:text-3xl font-bold text-purple-400 mt-1 sm:mt-2">
                      {stats.totalUsers > 0
                        ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <TrendingUp className="w-7 sm:w-10 h-7 sm:h-10 text-purple-500 opacity-50 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-3 sm:p-6">
              <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">All Users</h2>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No users found</p>
              ) : (
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700 hidden sm:table-row">
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                          Email
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                          Name
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                          Plan
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                          Status
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                          Credits
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                          Chat Uses
                        </th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/30 transition block sm:table-row mb-3 sm:mb-0 bg-slate-700/20 sm:bg-transparent rounded sm:rounded-none p-3 sm:p-0"
                        >
                          <td className="px-0 sm:px-4 py-1 sm:py-3 text-xs sm:text-sm text-white block sm:table-cell before:content-['Email:'] before:font-bold before:mr-2 sm:before:content-none">
                            {user.email}
                          </td>
                          <td className="px-0 sm:px-4 py-1 sm:py-3 text-xs sm:text-sm text-gray-400 block sm:table-cell before:content-['Name:'] before:font-bold before:mr-2 sm:before:content-none">
                            {user.name || "-"}
                          </td>
                          <td className="px-0 sm:px-4 py-1 sm:py-3 text-xs sm:text-sm block sm:table-cell before:content-['Plan:'] before:font-bold before:mr-2 sm:before:content-none">
                            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-blue-300 text-xs inline-block">
                              {user.subscription?.plan || "free"}
                            </span>
                          </td>
                          <td className="px-0 sm:px-4 py-1 sm:py-3 text-xs sm:text-sm block sm:table-cell before:content-['Status:'] before:font-bold before:mr-2 sm:before:content-none">
                            <span
                              className={`px-2 py-1 rounded text-xs inline-block ${
                                user.paymentStatus === "Paid"
                                  ? "bg-green-500/20 border border-green-500/50 text-green-300"
                                  : "bg-gray-500/20 border border-gray-500/50 text-gray-300"
                              }`}
                            >
                              {user.paymentStatus}
                            </span>
                          </td>
                          <td className="px-0 sm:px-4 py-1 sm:py-3 text-xs sm:text-sm text-white block sm:table-cell before:content-['Credits:'] before:font-bold before:mr-2 sm:before:content-none">
                            {user.credits}
                          </td>
                          <td className="px-0 sm:px-4 py-1 sm:py-3 text-xs sm:text-sm text-gray-400 block sm:table-cell before:content-['Chats:'] before:font-bold before:mr-2 sm:before:content-none">
                            {user.chatCount}
                          </td>
                          <td className="px-0 sm:px-4 py-1 sm:py-3 text-xs sm:text-sm text-gray-400 block sm:table-cell before:content-['Joined:'] before:font-bold before:mr-2 sm:before:content-none">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-3 sm:p-6 h-[60vh] sm:h-[70vh] flex flex-col">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-400 flex-shrink-0" />
              <h2 className="text-base sm:text-xl font-bold text-white truncate">Admin Chat</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 space-y-2 sm:space-y-4 bg-slate-900/30 rounded-lg p-2 sm:p-4 border border-slate-700/50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                      msg.role === "user"
                        ? "bg-cyan-500/20 border border-cyan-500/50"
                        : "bg-slate-700/50 border border-slate-600"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="text-cyan-100 whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-gray-100 text-sm sm:text-base">
                        <MarkdownRenderer text={msg.content} />
                      </div>
                    )}
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="mt-1 sm:mt-2 flex items-center gap-1 px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded transition text-gray-300"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={14} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 border border-slate-600 text-gray-100 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
                    <Loader className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !chatLoading && handleSendMessage()
                }
                placeholder="Message..."
                title="Type your message (unlimited credits)"
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                disabled={chatLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition flex items-center gap-1 sm:gap-2 font-medium flex-shrink-0"
                title="Send message"
              >
                <Send size={16} className="sm:w-18" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
