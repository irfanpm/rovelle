import ForgotPasswordForm from "@/modules/auth/components/ForgotPasswordForm";

export const metadata = {
  title: "Reset Password Link - Antigravity Dropship",
  description: "Request a password reset link to recover your account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
