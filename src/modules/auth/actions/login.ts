"use server";

import { signIn } from "@/lib/auth";
import { loginSchema, LoginInput } from "@/modules/auth/schemas";
import { AuthError } from "next-auth";

export async function loginAction(data: LoginInput) {
  try {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0]?.message || "Invalid email or password",
      };
    }

    const { email, password } = validated.data;

    // Trigger NextAuth credentials authentication
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Return response to handle navigation on the client
    });

    return {
      success: true,
      message: "Logged in successfully!",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      // Handle NextAuth errors
      const errorMsg = error.cause?.message || (error instanceof Error ? error.message : "Request failed") || "Invalid email or password";
      return {
        success: false,
        message: errorMsg,
      };
    }

    // Capture NextJS redirection signals if any
    if ((error instanceof Error ? error.message : "Request failed") && (error instanceof Error ? error.message : "Request failed").includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message: (error instanceof Error ? error.message : "Request failed") || "Authentication failed. Please check your credentials.",
    };
  }
}
