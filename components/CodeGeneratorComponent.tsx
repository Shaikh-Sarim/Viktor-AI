"use client";

import { useState } from "react";
import { Code2, Loader, Copy } from "lucide-react";

export default function CodeGeneratorComponent({
  onCreditsUpdated,
}: {
  onCreditsUpdated?: (credits: number) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const languages = ["python", "javascript", "typescript", "java", "cpp", "go", "rust"];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/code-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate code");
        return;
      }

      setResult(data.code);
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
    <div className="bg-slate-800 rounded-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Code2 className="w-6 h-6 text-cyan-500" />
        Code Generator
      </h2>

      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Language Select */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Programming Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Describe what you want to code
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a function to reverse a string"
            className="w-full h-24 p-4 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-3 px-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating Code...
            </>
          ) : (
            <>
              <Code2 className="w-5 h-5" />
              Generate Code
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-slate-900 rounded-lg overflow-hidden">
          <div className="bg-slate-700 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold">{language.toUpperCase()}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                alert("Code copied to clipboard!");
              }}
              className="flex items-center gap-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-slate-300 text-sm">{result}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
