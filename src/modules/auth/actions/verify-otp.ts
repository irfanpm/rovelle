"use server";

import { connectToDatabase } from "@/lib/db";
import User from "@/modules/auth/models/user.model";
import { verifyOtpSchema, VerifyOtpInput } from "@/modules/auth/schemas";

export async function verifyOtpAction(data: VerifyOtpInput) {
  try {
    const validated = verifyOtpSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0]?.message || "Invalid validation payload",
      };
    }

    const { email, otp } = validated.data;
    await connectToDatabase();

    // Query user and select verification tokens
    const user = await User.findOne({ email }).select(
      "+verificationOtp +verificationOtpExpires"
    );

    if (!user) {
      return { success: false, message: "User account not found." };
    }

    if (user.isVerified) {
      return { success: true, message: "Account is already verified." };
    }

    if (!user.verificationOtp || !user.verificationOtpExpires) {
      return {
        success: false,
        message: "No pending verification found. Please sign up again.",
      };
    }

    // Verify token expiration
    const isExpired = new Date() > user.verificationOtpExpires;
    if (isExpired) {
      return {
        success: false,
        message: "The verification code has expired. Please sign up again.",
      };
    }

    // Match code
    if (user.verificationOtp !== otp) {
      return { success: false, message: "Invalid verification code." };
    }

    // Update status
    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    await user.save();

    return {
      success: true,
      message: "Account verified successfully! You can now log in.",
    };
  } catch (error) {
    console.error("Verify OTP Action Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during verification.",
    };
  }
}
