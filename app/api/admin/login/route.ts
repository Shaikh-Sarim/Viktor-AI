import { NextRequest, NextResponse } from "next/server";

// ADMIN CREDENTIALS - Change these to your desired values
const ADMIN_ID = "viktor alvarez";
const ADMIN_PASSWORD = "viktor987";
const ADMIN_TOKEN_SECRET = "your-secret-admin-token-key";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, password } = body;

    if (!adminId || !password) {
      return NextResponse.json(
        { error: "Admin ID and password are required" },
        { status: 400 }
      );
    }

    if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
      // Create a simple token (in production, use JWT)
      const token = Buffer.from(`${ADMIN_ID}:${Date.now()}`).toString("base64");
      
      return NextResponse.json(
        { 
          success: true, 
          token,
          message: "Admin login successful"
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
