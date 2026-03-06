import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!GROQ_API_KEY || GROQ_API_KEY.includes("xxx")) {
      console.warn("GROQ_API_KEY not configured, using demo mode");
      const { prompt, language } = await request.json();
      
      return NextResponse.json({
        success: true,
        code: `# Demo Mode\n# This is placeholder code for: ${prompt}\n\n# To enable real code generation, add your GROQ_API_KEY to Vercel environment variables`,
        language: language || "python",
        demo: true
      });
    }

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, language } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Get user to check credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.credits < 8) {
      return NextResponse.json(
        { error: "Insufficient credits. Need 8 credits for code generation." },
        { status: 403 }
      );
    }

    // Call Groq API for code generation
    const systemPrompt = `You are an expert programmer. Generate clean, well-commented ${
      language || "Python"
    } code. Response should be ONLY the code, no explanations.`;

    const response = await axios.post(`${GROQ_API_URL}/chat/completions`, {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }, {
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const generatedCode = response.data.choices[0].message.content;

    // Deduct credits (8 credits per code generation)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 8 } },
    });

    // Log usage
    await prisma.usage.create({
      data: {
        userId: session.user.id,
        action: "code_generation",
        creditsUsed: 8,
      },
    });

    // Save code document
    const codeDoc = await prisma.document.create({
      data: {
        title: prompt.substring(0, 100),
        content: generatedCode,
        type: "code",
        wordCount: generatedCode.split(/\s+/).length,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      document: codeDoc,
      code: generatedCode,
      language: language || "Python",
      creditsRemaining: user.credits - 8,
    });
  } catch (error: any) {
    console.error("Error in code generation:", error.message);

    // Handle Groq API errors
    if (error.response?.status === 401) {
      return NextResponse.json(
        {
          error: "Invalid API key. Check your GROQ_API_KEY in .env.local",
        },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        {
          error: "Rate limited. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Code generation failed" },
      { status: error.response?.status || 500 }
    );
  }
}
