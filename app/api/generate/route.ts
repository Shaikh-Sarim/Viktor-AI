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
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not defined");
      return NextResponse.json(
        { error: "API configuration error: GROQ_API_KEY not set" },
        { status: 500 }
      );
    }

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, contentType } = await request.json();

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

    if (!user || user.credits < 10) {
      return NextResponse.json(
        { error: "Insufficient credits. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // Call Groq API to generate content
    const response = await axios.post(`${GROQ_API_URL}/chat/completions`, {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a professional content writer. Generate high-quality content." },
        { role: "user", content: `Generate a ${contentType || "general"} piece of content based on this request:\n\n${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }, {
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const generatedContent = response.data.choices[0].message.content;
    const wordCount = generatedContent.split(/\s+/).length;

    // Deduct credits (10 credits per generation)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 10 } },
    });

    // Log usage
    await prisma.usage.create({
      data: {
        userId: session.user.id,
        action: "generate_content",
        creditsUsed: 10,
      },
    });

    // Save document
    const document = await prisma.document.create({
      data: {
        title: prompt.substring(0, 100),
        content: generatedContent,
        type: contentType || "general",
        wordCount,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      document,
      generatedContent,
      creditsRemaining: user.credits - 10,
    });
  } catch (error: any) {
    console.error("Error generating content:", error.message);

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
      { error: error.message || "Failed to generate content" },
      { status: error.response?.status || 500 }
    );
  }
}
