import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifyAdminToken(token: string | null): boolean {
  // Simple token verification - in production, use JWT
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString();
    // Check if token has the format: "id:timestamp"
    return decoded.includes(":") && !isNaN(Number(decoded.split(":")[1]));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get("x-admin-token");
    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all users with their subscriptions
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: {
          select: {
            plan: true,
            credits: true,
            createdAt: true,
            expiresAt: true,
          },
        },
        chatMessages: {
          select: {
            id: true,
          },
        },
        documents: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response
    const formattedUsers = users.map((user) => ({
      ...user,
      subscription: user.subscriptions[0] || null,
      subscriptions: undefined,
      paymentStatus: user.subscriptions[0]?.plan !== "free" ? "Paid" : "Free",
      chatCount: user.chatMessages.length,
      documentCount: user.documents.length,
    }));

    return NextResponse.json(
      { 
        success: true, 
        users: formattedUsers,
        totalUsers: formattedUsers.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
