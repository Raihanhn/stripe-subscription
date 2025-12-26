import { getSession, signUp } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Create user
    const result = await signUp(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || "Sign up failed" },
        { status: 400 }
      );
    }

    // Create session
    const session = await getSession();
    session.userId = result.user.id;
    session.email = result.user.email;
    session.role = result.user.role;
    session.isLoggedin = true;

    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error("Error in signup API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
