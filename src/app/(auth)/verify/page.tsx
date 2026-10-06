import VerifyForm from "@/modules/auth/components/VerifyForm";
import { Suspense } from "react";

export const metadata = {
  title: "Verify Account - Antigravity Dropship",
  description: "Verify your email address using the 6-digit OTP code.",
};

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8 text-sm text-neutral-500">
          Loading verification code form...
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}
