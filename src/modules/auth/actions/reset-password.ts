"use server";

import { connectToDatabase } from "@/lib/db";
import User from "@/modules/auth/models/user.model";
import { resetPasswordSchema, ResetPasswordInput } from "@/modules/auth/schemas";
import bcrypt from "bcryptjs";

export async function resetPasswordAction(data: ResetPasswordInput) {
  try {
    const validated = resetPasswordSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0]?.message || "Invalid password data",
      };
    }

    const { token, password } = validated.data;
    await connectToDatabase();

    // Find the user with matching, non-expired token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        success: false,
        message: "The password reset link is invalid or has expired.",
      };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset tokens
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return {
      success: true,
      message: "Password reset successful. You can now log in with your new password.",
    };
  } catch (error) {
    console.error("Reset Password Action Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during password reset.",
    };
  }
}
