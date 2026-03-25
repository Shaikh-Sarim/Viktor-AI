"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain, Zap, Shield, BarChart3, Star, TrendingUp, Code2, Pencil, MessageSquare, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect("/dashboard");
  }

  // Fake user testimonials
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      avatar: "SC",
      company: "Content Studios Pro",
      rating: 5,
      text: "Viktor AI has revolutionized my content creation workflow. I now produce 10x more content in half the time. The AI is incredibly accurate and understands context perfectly.",
      image: "gradient-to-r from-pink-500 to-rose-500",
    },
    {
      name: "Michael Rodriguez",
      role: "Software Developer",
      avatar: "MR",
      company: "TechFlow Solutions",
      rating: 5,
      text: "The code generation feature is a game-changer. It helps me write boilerplate code and documentation in seconds. Already saved me 40+ hours this month!",
      image: "gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      name: "Emily Watson",
      role: "Marketing Manager",
      avatar: "EW",
      company: "Digital Growth Inc",
      rating: 5,
      text: "Our marketing campaigns got a massive boost thanks to Viktor AI. The content quality matches our brand voice perfectly, and our engagement rates went up 350%!",
      image: "gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "David Park",
      role: "Business Owner",
      avatar: "DP",
      company: "Park Ventures LLC",
      rating: 5,
      text: "Switched from expensive enterprise tools. Viktor AI offers the same features at a fraction of the cost. Best decision we made this year for our business.",
      image: "gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      name: "Jessica Brown",
      role: "Freelance Writer",
      avatar: "JB",
      company: "Wordsmith Collective",
      rating: 5,
      text: "As a writer, I was skeptical about AI. But Viktor AI is different - it actually respects my voice and helps me create better content faster. Now I'm taking on 3x more projects!",
      image: "gradient-to-r from-orange-500 to-red-500",
    },
    {
      name: "James Liu",
      role: "UI/UX Designer",
      avatar: "JL",
      company: "Pixel Perfect Design",
      rating: 5,
      text: "The web search integration is incredible. I can gather inspiration and research instantly. Combined with the content generation, my design process is now 60% faster.",
      image: "gradient-to-r from-indigo-500 to-violet-500",
    },
  ];

  // Statistics
  const stats = [
    { number: "50K+", label: "Active Users", icon: "👥" },
    { number: "500M+", label: "Words Generated", icon: "✍️" },
    { number: "4.9/5", label: "Avg Rating", icon: "⭐" },
    { number: "98%", label: "Satisfaction", icon: "😊" },
  ];

  // Features with descriptions
  const features = [
    {
      icon: <Pencil className="w-8 h-8" />,
      title: "Content Generation",
      description: "Create blog posts, emails, social media content, and product descriptions with AI precision.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Code Generation",
      description: "Generate boilerplate code, functions, and entire modules. Supports multiple programming languages.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Chat",
      description: "Interactive conversations with advanced AI. Get answers, brainstorm ideas, and solve problems.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-Time Web Search",
      description: "Get current information integrated into your content. Stay up-to-date with live data.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Smart Suggestions",
      description: "AI-powered recommendations to enhance your content quality and engagement.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and security. Your data is always protected and private.",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  // How it works steps
  const steps = [
    { number: "1", title: "Sign Up", description: "Create your account and get 100 free credits instantly" },
    { number: "2", title: "Choose Tool", description: "Select from content, code, or chat generation tools" },
    { number: "3", title: "Customize", description: "Adjust style, tone, and requirements to your needs" },
    { number: "4", title: "Generate", description: "Get AI-powered results in seconds with quality checked" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-in-up { animation: slideInUp 0.6s ease-out; }
        .animate-in-left { animation: slideInLeft 0.6s ease-out; }
        .animate-in-right { animation: slideInRight 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 animate-in-left">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 sm:p-2.5 rounded-lg shadow-lg shadow-cyan-500/50">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viktor AI</h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-4 animate-in-right">
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
          <div className="text-center mb-12 sm:mb-20 animate-in-up">
            <div className="mb-4 sm:mb-6 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-full backdrop-blur">
              <span className="text-xs sm:text-sm font-semibold text-green-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Trusted by 50K+ Users Worldwide
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Create Content<br/>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Instantly with AI</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Generate high-quality content in seconds using advanced AI models. Powered by cutting-edge AI technology with intelligent web search, real-time processing, and enterprise-grade security. From blog posts to code, Viktor AI handles it all.
            </p>
            <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105 flex items-center gap-2 group"
              >
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-4 sm:px-8 py-2.5 sm:py-4 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300 backdrop-blur hover:border-cyan-400"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24 animate-in-up" style={{ animationDelay: "0.2s" }}>
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 text-center group hover:border-cyan-500/50">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="mb-20 sm:mb-24">
            <div className="text-center mb-12 animate-in-up" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h3>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to create amazing content, code, and more</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 group animate-in-up"
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  <div className={`bg-gradient-to-br ${feature.color} p-3 sm:p-4 rounded-lg w-fit mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-110`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-24 animate-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h3>
              <p className="text-slate-400 text-lg">Start creating in just 4 simple steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-1/2 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  )}
                  <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 h-full group animate-in-up" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                    <div className="absolute -top-6 left-6 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 mt-4">{step.title}</h4>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-24 animate-in-up" style={{ animationDelay: "0.8s" }}>
            <div className="text-center mb-12">
              <div className="mb-4 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur">
                <span className="text-sm font-semibold text-cyan-300">⭐ Loved by Professionals</span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">What Users Say</h3>
              <p className="text-slate-400 text-lg">Join thousands of satisfied users creating amazing content</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl p-6 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 group animate-in-up"
                  style={{ animationDelay: `${0.9 + i * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.image} flex items-center justify-center font-bold text-white shadow-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                        <p className="text-xs text-slate-400">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-slate-300 mb-4 leading-relaxed italic">"{testimonial.text}"</p>

                  <div className="pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 animate-in-up" style={{ animationDelay: "1s" }}>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 group">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-slate-300 mb-6">Get responses in milliseconds, not minutes. Our optimized AI models deliver instant results without compromising quality.</p>
              <ul className="space-y-3">
                {["<100ms response time", "No waiting queues", "Instant export options"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-blue-500/50 group">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-slate-300 mb-6">Your data is encrypted and protected with military-grade security. We follow GDPR and ISO 27001 compliance standards.</p>
              <ul className="space-y-3">
                {["End-to-end encryption", "SOC 2 Type II certified", "Zero-knowledge architecture"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-24">
            <div className="text-center mb-16 animate-in-up" style={{ animationDelay: "1.1s" }}>
              <div className="mb-4 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur">
                <span className="text-sm font-semibold text-cyan-300">💰 Simple Pricing</span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Plan</h3>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Flexible pricing that grows with you. Always upgrade, downgrade, or cancel.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in-up" style={{ animationDelay: "1.2s" }}>
              {/* Free Plan */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50 group">
                <h4 className="text-2xl font-bold text-white mb-2">Free</h4>
                <p className="text-4xl font-bold text-cyan-400 mb-1">$0</p>
                <p className="text-slate-400 text-sm mb-6">Forever free</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">100 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Chat with AI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Web search</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
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
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-blue-500/50 group">
                <h4 className="text-2xl font-bold text-white mb-2">Basic</h4>
                <p className="text-4xl font-bold text-cyan-400 mb-1">$9<span className="text-lg text-slate-400">/mo</span></p>
                <p className="text-slate-400 text-sm mb-6">For hobbyists</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">500 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">API access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
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
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border-2 border-cyan-500/50 backdrop-blur lg:scale-105 transform transition-all duration-300 hover:scale-110 hover:border-cyan-400 shadow-2xl shadow-cyan-500/20 group">
                <div className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1.5 rounded-full inline-block mb-4 font-bold animate-pulse">
                  ⭐ MOST POPULAR
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Pro</h4>
                <p className="text-4xl font-bold text-white mb-1">$29<span className="text-lg text-cyan-200">/mo</span></p>
                <p className="text-cyan-200 text-sm mb-6">For professionals</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-cyan-400/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-cyan-50">2,000 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-cyan-50">Everything in Basic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-cyan-50">Full API access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-cyan-50">Advanced analytics</span>
                  </div>
                </div>
                <Link
                  href="/choose-plan"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg text-center transition-all duration-300 shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70"
                >
                  Choose Pro
                </Link>
              </div>

              {/* Pro+ Plan */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/50 group">
                <h4 className="text-2xl font-bold text-white mb-2">Pro+</h4>
                <p className="text-4xl font-bold text-cyan-400 mb-1">$79<span className="text-lg text-slate-400">/mo</span></p>
                <p className="text-slate-400 text-sm mb-6">For power users</p>
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">10,000 credits/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Dedicated support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
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

            <div className="text-center animate-in-up" style={{ animationDelay: "1.3s" }}>
              <Link
                href="/pricing"
                className="text-cyan-400 hover:text-cyan-300 font-semibold text-lg transition-colors duration-300 inline-flex items-center gap-2"
              >
                Explore all features <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 border border-cyan-500/50 rounded-3xl p-8 sm:p-12 md:p-16 text-center backdrop-blur mb-12 animate-in-up group hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300" style={{ animationDelay: "1.4s" }}>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 group-hover:text-cyan-200 transition-colors">
              Ready to transform your productivity?
            </h3>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join 50K+ professionals. Start with 100 free credits. No credit card required. Cancel anytime.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="mb-24 animate-in-up" style={{ animationDelay: "1.5s" }}>
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { q: "How many credits does each generation use?", a: "Most content generations use 5-20 credits depending on length and complexity. Chat messages use 2-5 credits. Code generation uses 10-30 credits." },
                { q: "Can I upgrade or downgrade anytime?", a: "Yes! Change your plan anytime. Upgrades take effect immediately, downgrades at the end of your billing cycle." },
                { q: "Is there a free trial?", a: "You get 100 free credits when you sign up. No credit card needed. Use them to explore all features risk-free." },
                { q: "What happens when I run out of credits?", a: "You'll get a notification. Upgrade your plan or wait for your monthly credit reset. Free tier users get 100 credits monthly." },
              ].map((faq, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:border-cyan-500/50">
                  <h4 className="font-bold text-white text-lg mb-3">{faq.q}</h4>
                  <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center pb-12 animate-in-up" style={{ animationDelay: "1.6s" }}>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 backdrop-blur">
              <p className="text-slate-400 mb-4">Still have questions?</p>
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Contact our support team →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md mt-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h5 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Viktor AI
                </h5>
                <p className="text-slate-400 text-sm">Create amazing content instantly with advanced AI.</p>
              </div>
              <div>
                <h5 className="font-bold text-white mb-4">Product</h5>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                  <li><Link href="/features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
                  <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-4">Company</h5>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors">About</Link></li>
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-4">Legal</h5>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors">Privacy</Link></li>
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors">Terms</Link></li>
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors">Security</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-700/50 pt-8 text-center text-slate-500 text-sm">
              <p>&copy; 2026 Viktor AI. All rights reserved. Powered by advanced AI technology.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
