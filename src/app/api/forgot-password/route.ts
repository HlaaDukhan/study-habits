import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Always return generic message to prevent email enumeration
    const genericResponse = NextResponse.json({
      message: "If an account with that email exists, we sent a reset link.",
    });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return genericResponse;
    }

    // Rate limit: skip if a token was created < 5 min ago
    const recentToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        createdAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
      },
    });

    if (recentToken) {
      return genericResponse;
    }

    // Delete old tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail(email, token);

    return genericResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
