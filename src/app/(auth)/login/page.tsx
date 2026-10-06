import LoginForm from "@/modules/auth/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Sign In - Antigravity Dropship",
  description: "Log in to your account to manage orders, wishlist, and check out.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8 text-sm text-neutral-500">
          Loading sign in form...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
