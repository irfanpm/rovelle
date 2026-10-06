import ResetPasswordForm from "@/modules/auth/components/ResetPasswordForm";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password - Antigravity Dropship",
  description: "Set a new password to recover access to your account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8 text-sm text-neutral-500">
          Loading password reset form...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
