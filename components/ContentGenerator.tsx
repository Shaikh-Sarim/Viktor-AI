"use client";

import { useState } from "react";
import { Sparkles, Loader } from "lucide-react";

export default function ContentGenerator({
  onCreditsUpdated,
}: {
  onCreditsUpdated?: (credits: number) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("blog_post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contentTypes = [
    { id: "blog_post", label: "Blog Post", icon: "📝" },
    { id: "social_media", label: "Social Media", icon: "📱" },
    { id: "email", label: "Email", icon: "✉️" },
    { id: "product_description", label: "Product Description", icon: "🛍️" },
    { id: "ad_copy", label: "Ad Copy", icon: "📢" },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          contentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate content");
        return;
      }

      setResult(data.generatedContent);
      setPrompt("");
      if (onCreditsUpdated && data.creditsRemaining !== undefined) {
        onCreditsUpdated(data.creditsRemaining);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-slate-800 rounded-lg sm:rounded-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
          Generate Content
        </h2>

        <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-6">
          {/* Content Type Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">
              Content Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setContentType(type.id)}
                  className={`p-2 sm:p-3 rounded-lg text-center transition text-xs sm:text-sm ${
                    contentType === type.id
                      ? "bg-cyan-600 text-white font-semibold"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  <div className="text-base sm:text-lg mb-1">{type.icon}</div>
                  <div className="text-xs sm:text-sm">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-white mb-2">
              Your Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate... Be as specific as possible for better results."
              className="w-full h-24 sm:h-32 p-3 sm:p-4 bg-slate-700 text-sm sm:text-base text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Generate Content
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 sm:p-4">
          <p className="text-red-300 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-slate-700 rounded-lg p-4 sm:p-6 md:p-8">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4">Generated Content</h3>
          <div className="bg-slate-800 rounded-lg p-3 sm:p-4 max-h-72 sm:max-h-96 overflow-y-auto">
            <p className="text-slate-300 whitespace-pre-wrap text-xs sm:text-sm">{result}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result);
              alert("Copied to clipboard!");
            }}
            className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition text-xs sm:text-sm font-semibold"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
