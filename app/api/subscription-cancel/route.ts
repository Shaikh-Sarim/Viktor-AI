import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Don't allow cancellation of free plan
    if (subscription.plan === "free") {
      return NextResponse.json(
        { error: "Cannot cancel free plan" },
        { status: 400 }
      );
    }

    // Update subscription to free plan
    const updatedSubscription = await prisma.subscription.update({
      where: { userId: userId },
      data: {
        plan: "free",
        credits: 100,
        stripeId: null, // Clear payment ID
      },
    });

    // Update user credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: 100,
      },
    });

    console.log(`✓ Subscription cancelled for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully. You've been moved to the Free plan.",
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
