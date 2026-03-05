import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

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
  ];
  
  const lowerText = text.toLowerCase();
  return vagueIndicators.some(indicator => lowerText.includes(indicator));
}

// Function to search web with Tavily
async function searchWeb(query: string): Promise<string | null> {
  if (!TAVILY_API_KEY || TAVILY_API_KEY.includes("xxxxxx")) {
    console.log("Tavily API key not configured, skipping web search");
    return null;
  }

  try {
    console.log("Calling Tavily Web Search API...");
    const response = await axios.post("https://api.tavily.com/search", {
      api_key: TAVILY_API_KEY,
      query: query,
      max_results: 3,
      include_answer: true,
    });

    if (response.data.answer) {
      console.log("✓ Tavily found current information");
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
    console.log("=== Chat API Request ===");
    
    // Check if API key exists
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not defined in environment variables");
      return NextResponse.json(
        { error: "API configuration error: GROQ_API_KEY not set. Add it to .env.local and restart the server." },
        { status: 500 }
      );
    }
    console.log("✓ GROQ_API_KEY exists");

    const session = await auth();
    console.log("Session:", session);

    if (!session || !session.user) {
      console.error("No session or user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("✓ User authenticated:", session.user.id);

    let prompt = "";
    let documentContent = "";

    // Check if request is FormData (with files) or JSON
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      // Handle FormData with documents
      const formData = await request.formData();
      prompt = formData.get("prompt") as string || "";
      
      const documents = formData.getAll("documents");
      console.log(`Received ${documents.length} documents`);
      
      // Process documents
      for (const doc of documents) {
        if (doc instanceof File) {
          try {
            const fileType = doc.type;
            const fileName = doc.name;
            const fileSize = (doc.size / 1024).toFixed(2); // KB
            
            // Handle image files
            if (fileType.startsWith("image/")) {
              try {
                const buffer = await doc.arrayBuffer();
                
                // Extremely aggressively compress the image using Sharp
                const compressedBuffer = await sharp(Buffer.from(buffer))
                  .resize(300, 300, {
                    fit: "inside",
                    withoutEnlargement: true,
                  })
                  .jpeg({ quality: 40, progressive: true })
                  .toBuffer();
                
                const base64Image = compressedBuffer.toString("base64");
                const compressedSize = (compressedBuffer.length / 1024).toFixed(2);
                
                // Send compressed image as base64 with proper format
                documentContent += `\n--- Image: ${fileName} ---\nImage Data (Compressed ${compressedSize}KB): data:image/jpeg;base64,${base64Image}\n`;
                console.log(`✓ Processed image: ${fileName} (Compressed: ${compressedSize}KB)`);
              } catch (imgErr) {
                console.error(`Failed to compress image ${fileName}:`, imgErr);
                documentContent += `\n--- Image: ${fileName} ---\nImage uploaded but too large. Please describe what's in the image.\n`;
              }
            }
            // Handle PowerPoint files
            else if (
              fileType === "application/vnd.ms-powerpoint" ||
              fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ) {
              documentContent += `\n--- PowerPoint Presentation: ${fileName} ---\nThe user has uploaded a PowerPoint presentation. Refer to details they provide about it in their query.\n`;
              console.log(`✓ Processed PowerPoint: ${fileName}`);
            }
            // Handle text-based documents
            else {
              const fileContent = await doc.text();
              documentContent += `\n--- Document: ${fileName} ---\n${fileContent}\n`;
              console.log(`✓ Processed text document: ${fileName}`);
            }
          } catch (err) {
            console.error(`Failed to process document ${doc.name}:`, err);
          }
        }
      }
    } else {
      // Handle JSON request
      try {
        const body = await request.json();
        console.log("Request body:", body);
        prompt = body.prompt;
      } catch (parseError) {
        console.error("Error parsing request body:", parseError);
        return NextResponse.json(
          { error: "Invalid request body. Please check your input." },
          { status: 400 }
        );
      }
    }

    if (!prompt?.trim() && !documentContent.trim()) {
      console.error("Empty prompt and no documents received");
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }
    console.log("✓ Prompt received:", prompt);

    // Get user to check credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    console.log("User found:", user?.email, "Credits:", user?.credits);

    if (!user || user.credits < 5) {
      console.error("Insufficient credits:", user?.credits);
      return NextResponse.json(
        { error: "Insufficient credits. Need 5 credits for chat." },
        { status: 403 }
      );
    }
    console.log("✓ User has sufficient credits");

    // Call Groq API for chat
    console.log("Calling Groq API with model:", GROQ_MODEL);
    
    // Construct the content message with documents if provided
    let messageContent = prompt;
    if (documentContent.trim()) {
      messageContent = `${documentContent}\n\nUser Query:\n${prompt}`;
      console.log("✓ Document content included in message");
    }
    
    let response;
    try {
      response = await axios.post(`${GROQ_API_URL}/chat/completions`, {
        model: GROQ_MODEL,
        messages: [{ role: "user", content: messageContent }],
        temperature: 0.7,
        max_tokens: 1024,
      }, {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✓ Groq API responded with status:", response.status);
    } catch (groqError: any) {
      console.error("🔴 Groq API Error Details:");
      console.error("Status Code:", groqError.response?.status);
      console.error("Response Data:", JSON.stringify(groqError.response?.data, null, 2));
      console.error("Request URL:", groqError.config?.url);
      console.error("Request Headers:", { ...groqError.config?.headers, Authorization: "***" });
      throw groqError; // Re-throw to be caught by outer catch
    }

    let responseText = response.data.choices[0].message.content;
    console.log("Response from Groq:", responseText.substring(0, 100) + "...");

    // Check if response is vague and needs web search
    if (isResponseVague(responseText)) {
      console.log("📝 Groq response lacks information about current events, attempting web search...");
      const webAnswer = await searchWeb(prompt);
      
      if (webAnswer) {
        // If web search succeeds, use ONLY the web result
        responseText = `📰 **Current Information**:\n${webAnswer}`;
        console.log("✓ Using web search result instead of vague Groq response");
      } else {
        // If web search fails, keep the Groq response anyway
        console.log("⚠ Web search failed, returning Groq response");
      }
    }

    // Deduct credits (5 credits per chat message)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 5 } },
    });
    console.log("✓ Credits deducted");

    // Log usage
    await prisma.usage.create({
      data: {
        userId: session.user.id,
        action: "chat_message",
        creditsUsed: 5,
      },
    });

    // Save chat message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        prompt,
        response: responseText,
        tokens: responseText.split(/\s+/).length,
      },
    });
    console.log("✓ Chat message saved");

    return NextResponse.json({
      success: true,
      chatMessage,
      response: responseText,
      creditsRemaining: user.credits - 5,
    });
  } catch (error: any) {
    console.error("=== Chat API Error ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    // Handle Groq API errors
    if (error.response?.status === 401) {
      console.error("Groq API: Invalid key");
      return NextResponse.json(
        {
          error: "Invalid API key. Check your GROQ_API_KEY in .env.local",
        },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      console.error("Groq API: Rate limited");
      return NextResponse.json(
        {
          error: "Rate limited. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    // Default error response
    const statusCode = error.response?.status || 500;
    const errorMsg = error.message || "Failed to generate response";
    console.error(`Returning error: ${statusCode} - ${errorMsg}`);
    
    return NextResponse.json(
      { error: errorMsg },
      { status: statusCode }
    );

  }
}
