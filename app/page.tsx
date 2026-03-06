"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain, Zap, Shield, BarChart3 } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect("/dashboard");
  }

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
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 sm:p-2.5 rounded-lg shadow-lg shadow-cyan-500/50">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viktor AI</h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-4">
              <Link href="/login" className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all duration-300 border border-slate-600 hover:border-cyan-500/50 whitespace-nowrap">
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 sm:px-6 py-1.5 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105 text-xs sm:text-base whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-24">
          <div className="text-center mb-12 sm:mb-20">
            <div className="mb-4 sm:mb-6 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-full backdrop-blur">
              <span className="text-xs sm:text-sm font-semibold text-green-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online & Ready
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Create Content<br/>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Instantly with AI</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Generate high-quality content in seconds using advanced AI models. Cloud-powered with intelligent search capabilities and real-time processing.
            </p>
            <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105 flex items-center gap-2"
              >
                Get Started Free →
              </Link>
              <Link
                href="/login"
                className="px-4 sm:px-8 py-2.5 sm:py-4 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300 backdrop-blur hover:border-cyan-400"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-24">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 group">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 sm:p-3 md:p-3.5 rounded-lg w-fit mb-3 sm:mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-shadow duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">⚡ Lightning Fast</h3>
              <p className="text-slate-300 leading-relaxed">
                Generate content instantly with enterprise-grade AI. Real-time processing with integrated web search for accurate, up-to-date results.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-blue-500/50 group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3.5 rounded-lg w-fit mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-shadow duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">🔒 Secure & Smart</h3>
              <p className="text-slate-300 leading-relaxed">
                Enterprise-grade AI with secure processing and advanced search capabilities. Built for professionals who demand speed and accuracy.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/50 group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3.5 rounded-lg w-fit mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-shadow duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">📊 Multi-Purpose</h3>
              <p className="text-slate-300 leading-relaxed">
                Blog posts, emails, code, social media, product descriptions, and much more.
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <div className="mb-4 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur">
                <span className="text-sm font-semibold text-cyan-300">Simple Pricing</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-bold text-white mb-4">Choose Your Plan</h3>
              <p className="text-slate-300 text-xl max-w-2xl mx-auto">Flexible pricing that grows with you. Always upgrade, downgrade, or cancel.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Free Plan */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 group">
                <h4 className="text-2xl font-bold text-white mb-2">Free</h4>
                <p className="text-4xl font-bold text-cyan-400 mb-1">$0</p>
                <p className="text-slate-400 text-sm mb-6">Forever free</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">100 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">Chat with AI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">Web search</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">Content generation</span>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="block w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-center transition-all duration-300 group-hover:bg-cyan-600/20 group-hover:border-cyan-500"
                >
                  Get Started
                </Link>
              </div>

              {/* Basic Plan */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-blue-500/50">
                <h4 className="text-2xl font-bold text-white mb-2">Basic</h4>
                <p className="text-4xl font-bold text-cyan-400 mb-1">$9<span className="text-lg text-slate-400">/mo</span></p>
                <p className="text-slate-400 text-sm mb-6">For hobbyists</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">500 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">API access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">Priority support</span>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="block w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-center transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>

              {/* Pro Plan - Featured */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border-2 border-cyan-500/50 backdrop-blur lg:scale-105 transform transition-all duration-300 hover:scale-110 hover:border-cyan-400 shadow-2xl shadow-cyan-500/20">
                <div className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1.5 rounded-full inline-block mb-4 font-bold animate-pulse">
                  ⭐ MOST POPULAR
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Pro</h4>
                <p className="text-4xl font-bold text-white mb-1">$29<span className="text-lg text-cyan-200">/mo</span></p>
                <p className="text-cyan-200 text-sm mb-6">For professionals</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-cyan-400/30">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span className="text-cyan-50">2,000 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span className="text-cyan-50">Everything in Basic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span className="text-cyan-50">Full API access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span className="text-cyan-50">Advanced analytics</span>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg text-center transition-all duration-300 shadow-lg shadow-cyan-500/50"
                >
                  View All Plans
                </Link>
              </div>

              {/* Pro+ Plan */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/50">
                <h4 className="text-2xl font-bold text-white mb-2">Pro+</h4>
                <p className="text-4xl font-bold text-cyan-400 mb-1">$79<span className="text-lg text-slate-400">/mo</span></p>
                <p className="text-slate-400 text-sm mb-6">For power users</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">10,000 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">Dedicated support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-slate-300">White-label options</span>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="block w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-center transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/pricing"
                className="text-cyan-400 hover:text-cyan-300 font-semibold text-lg transition-colors duration-300 inline-flex items-center gap-2"
              >
                Explore all features →
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 border border-cyan-500/50 rounded-3xl p-16 text-center backdrop-blur mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to start creating?
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Get started with 100 free credits. No credit card required. Full access to all features.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
