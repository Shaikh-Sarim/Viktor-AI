"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, MessageCircle, Copy, Check } from "lucide-react";

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

export default function ChatComponent({
  onCreditsUpdated,
}: {
  onCreditsUpdated?: (credits: number) => void;
}) {
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([
    {
      id: "0",
      role: "assistant",
      content: "👋 Hello! I'm your AI assistant. I can help you with content generation, coding, web search, and much more. What would you like to talk about?",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;

    setError(null);
    const userMessage = input;
    const userMessageId = Date.now().toString();
    
    setInput("");
    const updatedMessages = [...messages, { id: userMessageId, role: "user", content: userMessage || "(Document uploaded)" }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("prompt", userMessage);
      
      // Add conversation history to FormData
      const conversationHistory = updatedMessages
        .slice(0, -1) // Exclude the message we just added
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      formData.append("conversationHistory", JSON.stringify(conversationHistory));
      
      uploadedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error("Failed to parse response:", parseErr);
        setError("Server error: Check console logs");
        return;
      }

      if (!response.ok) {
        console.error(`API error (${response.status}):`, data);
        setError(data.error || `Server error: ${response.status}`);
        return;
      }

      if (!data.response) {
        setError("No response from AI");
        return;
      }

      if (onCreditsUpdated && data.creditsRemaining !== undefined) {
        onCreditsUpdated(data.creditsRemaining);
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now()).toString(), role: "assistant", content: data.response },
      ]);
      
      setUploadedFiles([]);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const validTypes = [
        // Documents
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // PowerPoint
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        // Images
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp"
      ];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });

    if (validFiles.length !== files.length) {
      setError("Some files were rejected. Only PDF, TXT, DOC, DOCX, PPT, PPTX, and image files (JPG, PNG, GIF, WebP, BMP) up to 10MB are allowed.");
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-800/50 rounded-lg sm:rounded-2xl p-3 sm:p-6 md:p-8 h-[600px] sm:h-[600px] md:h-[600px] flex flex-col border border-slate-700/50 backdrop-blur">
      <h2 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
        <span className="hidden sm:inline">AI Chat with Documents</span>
        <span className="sm:hidden">AI Chat</span>
      </h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-3 sm:mb-6 space-y-3 sm:space-y-4 bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-700/50">
        {messages.length === 1 && messages[0].role === "assistant" ? (
          <div className="text-slate-400 text-center py-8 text-xs sm:text-sm">
            <p>Start a conversation with AI... Upload documents for analysis</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 sm:px-4 py-2 max-w-2xl text-xs sm:text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-slate-600/50 text-slate-100 border border-slate-500/30"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div>
                    <MarkdownRenderer text={msg.content} />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.content);
                        setCopiedId(msg.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="mt-2 flex items-center gap-1 px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded transition text-gray-300"
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
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-600/50 text-slate-100 rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2 border border-slate-500/30 text-xs sm:text-sm">
              <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
          <p className="text-purple-300 text-xs sm:text-sm font-semibold mb-2">📄 Docs: {uploadedFiles.length}</p>
          <div className="space-y-1">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-700/50 p-1.5 sm:p-2 rounded border border-slate-600/50">
                <span className="text-xs text-slate-300 truncate">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(idx)}
                  className="p-1 hover:bg-red-600/50 rounded transition text-xs sm:text-sm"
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 border border-red-600/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 backdrop-blur">
          <p className="text-red-300 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="space-y-2 sm:space-y-3">
        <div className="flex gap-1 sm:gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask..."
            disabled={loading}
            className="flex-1 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-slate-700/50 text-xs sm:text-base text-white rounded-lg border border-slate-600/50 focus:border-cyan-500 focus:outline-none disabled:opacity-50 transition"
          />
          <label className="px-2 sm:px-4 py-2 sm:py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg border border-slate-600/50 cursor-pointer transition flex items-center gap-1 text-xs sm:text-base">
            📎
            <span className="hidden sm:inline">Upload</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.bmp"
            />
          </label>
          <button
            type="submit"
            disabled={loading || (!input.trim() && uploadedFiles.length === 0)}
            className="px-2.5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition flex items-center gap-1 sm:gap-2 shadow-lg shadow-cyan-500/30 disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-tight">PDF, TXT, DOC, DOCX, PPT, PPTX, Images (Max 10MB each)</p>
      </form>
    </div>
  );
}
