import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API = "https://api.sandbox.paypal.com"; // Use sandbox for testing
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

const PLAN_CREDITS: Record<string, number> = {
  basic: 500,
  pro: 2000,
  pro_plus: 10000,
};

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    "base64"
  );

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

async function capturePayPalOrder(orderId: string, accessToken: string) {
  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to capture PayPal order");
  }

  return await response.json();
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.redirect(
        new URL("/login", request.nextUrl.origin)
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("token");
    const plan = searchParams.get("plan");

    if (!orderId || !plan) {
      return NextResponse.redirect(
        new URL("/choose-plan?error=Invalid payment", request.nextUrl.origin)
      );
    }

    if (!PLAN_CREDITS[plan]) {
      return NextResponse.redirect(
        new URL("/choose-plan?error=Invalid plan", request.nextUrl.origin)
      );
    }

    const accessToken = await getPayPalAccessToken();
    const capturedOrder = await capturePayPalOrder(orderId, accessToken);

    if (capturedOrder.status !== "COMPLETED") {
      return NextResponse.redirect(
        new URL(
          "/choose-plan?error=Payment not completed",
          request.nextUrl.origin
        )
      );
    }

    // Payment successful - create subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan: plan,
        credits: PLAN_CREDITS[plan],
        stripeId: orderId, // Store PayPal order ID
      },
      update: {
        plan: plan,
        credits: PLAN_CREDITS[plan],
        stripeId: orderId,
      },
    });

    // Update user credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: PLAN_CREDITS[plan],
      },
    });

    console.log(
      `✓ Payment successful for ${plan} plan - User: ${session.user.id}`
    );

    // Redirect to dashboard
    return NextResponse.redirect(
      new URL(
        "/dashboard?payment=success",
        request.nextUrl.origin
      )
    );
  } catch (error: any) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.redirect(
      new URL(
        "/choose-plan?error=" + encodeURIComponent(error.message),
        request.nextUrl.origin
      )
    );
  }
}
