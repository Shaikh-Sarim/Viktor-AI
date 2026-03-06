"use client";

import { useState, useRef } from "react";
import { Send, Loader, MessageCircle } from "lucide-react";

export default function ChatComponent({
  onCreditsUpdated,
}: {
  onCreditsUpdated?: (credits: number) => void;
}) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;

    setError(null);
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage || "(Document uploaded)" }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("prompt", userMessage);
      
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
        { role: "assistant", content: data.response },
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
        {messages.length === 0 ? (
          <div className="text-slate-400 text-center py-8 text-xs sm:text-sm">
            <p>Start a conversation with AI... Upload documents for analysis</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 sm:px-4 py-2 max-w-xs sm:max-w-md text-xs sm:text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-slate-600/50 text-slate-100 border border-slate-500/30"
                }`}
              >
                {msg.content}
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
