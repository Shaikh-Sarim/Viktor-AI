import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString();
    // Check if token has the format: "id:timestamp"
    return decoded.includes(":") && !isNaN(Number(decoded.split(":")[1]));
  } catch {
    return false;
  }
}

// Function to detect if Groq response is vague about current events
function isResponseVague(text: string): boolean {
  const vagueIndicators = [
    "my knowledge cutoff",
    "i don't have information",
    "i'm not aware",
    "i don't have access to current",
    "i cannot browse the internet",
    "as of my last training",
    "2023",
    "2024 updates",
    "i don't have real-time",
    "unable to provide current",
    "my training data",
    "i don't know",
    "unable to access",
    "outside my knowledge",
    "not available to me",
    "cannot determine",
    "unclear",
  ];
  
  const lowerText = text.toLowerCase();
  const isVague = vagueIndicators.some(indicator => lowerText.includes(indicator));
  
  if (isVague) {
    console.log("✓ Response detected as vague, will trigger web search");
  }
  
  return isVague;
}

// Function to search web with Tavily
async function searchWeb(query: string): Promise<string | null> {
  if (!TAVILY_API_KEY) {
    console.log("Tavily API key not configured, skipping web search");
    return null;
  }

  try {
    console.log("Calling Tavily Web Search API for admin...");
    const response = await axios.post("https://api.tavily.com/search", {
      api_key: TAVILY_API_KEY,
      query: query,
      max_results: 3,
      include_answer: true,
    });

    if (response.data.answer) {
      console.log("✓ Tavily found current information for admin");
      return response.data.answer;
    }
    return null;
  } catch (error) {
    console.error("Tavily search error:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("x-admin-token");
    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not defined");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build message history for context
    let messages: any[] = [
      {
        role: "system",
        content: "You are an Admin Assistant for Viktor AI SaaS platform. You have unlimited access to all features and data. Help the admin manage the platform, analyze users, and test features. Be professional and precise. Format your responses with markdown for code blocks, bold text for emphasis, and bullet points for lists. Use proper formatting and structure your answers clearly."
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      // Only include last 10 messages to keep context size manageable
      const recentHistory = conversationHistory.slice(-10);
      messages = messages.concat(recentHistory);
    }

    // Call Groq API for chat
    console.log("Admin calling Groq API with model:", GROQ_MODEL);
    
    let response;
    try {
      response = await axios.post(`${GROQ_API_URL}/chat/completions`, {
        model: GROQ_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
      }, {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✓ Groq API responded with status:", response.status);
    } catch (groqError: any) {
      console.error("Groq API Error:", groqError.response?.data || groqError.message);
      throw groqError;
    }

    let responseText = response.data.choices[0].message.content;
    console.log("Response from Groq:", responseText.substring(0, 100) + "...");

    // Always attempt web search for questions that likely need current info
    const currentEventKeywords = [
      "what's new",
      "latest",
      "today",
      "recent",
      "news",
      "current",
      "right now",
      "2025",
      "2026",
      "update",
      "trends",
      "stock",
      "weather",
    ];
    
    const isCurrenEventQuery = currentEventKeywords.some(kw => message.toLowerCase().includes(kw));
    
    // Check if response is vague OR if it's a current event query
    if (isResponseVague(responseText) || isCurrenEventQuery) {
      console.log("Attempting web search (vague response or current event query)...");
      const webAnswer = await searchWeb(message);
      
      if (webAnswer) {
        responseText = `📰 **Current Information**:\n${webAnswer}`;
        console.log("✓ Using web search result for admin");
      } else {
        console.log("⚠ Web search failed or had no results, keeping Groq response");
      }
    }

    return NextResponse.json(
      {
        success: true,
        response: responseText,
        isAdmin: true,
        unlimited: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin chat error:", error);
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key configuration" },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
