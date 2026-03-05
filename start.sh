#!/usr/bin/env bash

# ContentAI - Quick Start Script
# This script sets up and runs your AI-powered SaaS platform

echo "🚀 ContentAI - AI-Powered Content Generation Platform"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Check if Ollama is running
echo "🤖 Checking for Ollama..."
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Warning: Ollama doesn't seem to be running!"
    echo "   Please run: ollama serve"
    echo "   In another terminal, run: ollama pull mistral"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Ollama is running"
fi

echo ""
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🎉 Starting development server..."
echo "📱 Open http://localhost:3000 in your browser"
echo ""

npm run dev
