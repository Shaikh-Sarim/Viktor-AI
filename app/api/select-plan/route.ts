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

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !PLAN_CREDITS[plan]) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Update or create subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan: plan,
        credits: PLAN_CREDITS[plan],
      },
      update: {
        plan: plan,
        credits: PLAN_CREDITS[plan],
      },
    });

    // Update user credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: PLAN_CREDITS[plan],
      },
    });

    console.log(`✓ Plan selected: ${plan} for user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error: any) {
    console.error("Error selecting plan:", error);
    return NextResponse.json(
      { error: "Failed to select plan" },
      { status: 500 }
    );
  }
}
