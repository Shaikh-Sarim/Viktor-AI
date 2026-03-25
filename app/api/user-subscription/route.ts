import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { plan: true, credits: true, createdAt: true },
    });

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        requiresPayment: true,
        message: "No subscription found. Please select a plan.",
      });
    }

    // Check if subscription is for a paid plan
    const paidPlans = ["basic", "pro", "pro_plus"];
    const isPaidPlan = paidPlans.includes(subscription.plan);

    return NextResponse.json({
      hasSubscription: true,
      plan: subscription.plan,
      credits: subscription.credits,
      isPaidPlan: isPaidPlan,
      createdAt: subscription.createdAt,
    });
  } catch (error: any) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
