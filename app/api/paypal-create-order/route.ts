import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API = "https://api.sandbox.paypal.com"; // Use sandbox for testing, change to https://api.paypal.com for production
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

const PLAN_PRICES: Record<string, { amount: string; credits: number }> = {
  basic: { amount: "9.99", credits: 500 },
  pro: { amount: "29.99", credits: 2000 },
  pro_plus: { amount: "79.99", credits: 10000 },
};

// Get PayPal access token
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // If PayPal not configured, create subscription directly (for testing)
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      console.warn("PayPal not configured. Creating subscription without payment.");
      const subscription = await prisma.subscription.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          plan: plan,
          credits: PLAN_PRICES[plan].credits,
        },
        update: {
          plan: plan,
          credits: PLAN_PRICES[plan].credits,
        },
      });

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          credits: PLAN_PRICES[plan].credits,
        },
      });

      return NextResponse.json({
        success: true,
        subscription,
        testMode: true,
      });
    }

    const planInfo = PLAN_PRICES[plan];
    const accessToken = await getPayPalAccessToken();
    const returnBaseUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}`;

    const paypalOrder = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: planInfo.amount,
            },
            description: `${plan.toUpperCase()} Plan - ${planInfo.credits} Monthly Credits`,
          },
        ],
        application_context: {
          return_url: `${returnBaseUrl}/api/paypal-complete?plan=${plan}`,
          cancel_url: `${returnBaseUrl}/choose-plan?canceled=true`,
          brand_name: "Viktor AI",
          locale: "en-US",
          landing_page: "LOGIN",
        },
      }),
    });

    if (!paypalOrder.ok) {
      const error = await paypalOrder.json();
      console.error("PayPal order creation error:", error);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    const orderData = await paypalOrder.json();

    // Store plan selection temporarily (you might want to use a cache or temp DB)
    // For now, we'll rely on the plan being passed back after PayPal approval

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      approvalUrl: orderData.links.find((link: any) => link.rel === "approve_link")
        ?.href,
    });
  } catch (error: any) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}
