import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PLAN_CREDITS: Record<string, number> = {
  free: 100,
  basic: 500,
  pro: 2000,
  pro_plus: 10000,
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log("Session:", session);

    if (!session || !session.user) {
      console.error("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    console.log("User ID from session:", userId);
    
    if (!userId) {
      console.error("No user ID in session");
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const body = await request.json();
    const { plan } = body;
    console.log("Plan requested:", plan);

    if (!plan || !PLAN_CREDITS[plan]) {
      console.error("Invalid plan:", plan);
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    console.log("Attempting to upsert subscription for userId:", userId);
    
    // Check if user exists first
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.error("User not found in database:", userId);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("User found, creating/updating subscription");
    
    // Update or create subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: userId },
      create: {
        userId: userId,
        plan: plan,
        credits: PLAN_CREDITS[plan],
      },
      update: {
        plan: plan,
        credits: PLAN_CREDITS[plan],
      },
    });

    console.log("Subscription created/updated:", subscription);

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: PLAN_CREDITS[plan],
      },
    });

    console.log("User credits updated:", updatedUser);
    console.log(`✓ Plan selected: ${plan} for user ${userId}`);

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any).code;
    
    console.error("DETAILED ERROR in select-plan:", {
      message: errorMessage,
      code: errorCode,
      stack: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString(),
      userId,
      plan
    });
    
    return NextResponse.json(
      { error: "Failed to select plan", details: errorMessage },
      { status: 500 }
    );
  }
}
