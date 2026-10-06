"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordSchema, ResetPasswordInput } from "../schemas";
import { resetPasswordAction } from "../actions/reset-password";
import { Input } from "@/modules/shared/components/Input";
import { Button } from "@/modules/shared/components/Button";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await resetPasswordAction(data);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 border bg-white border-neutral-100 rounded-md dark:bg-neutral-900 dark:border-neutral-800 shadow-xl shadow-neutral-100/50 dark:shadow-none">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Reset password
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Enter and confirm your new password below
        </p>
      </div>

      {!token ? (
        <div className="p-4 mb-6 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl dark:bg-red-950/20 dark:border-red-900/50">
          Invalid reset link. The reset token is missing.
        </div>
      ) : (
        <>
          {error && (
            <div className="p-4 mb-6 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl dark:bg-red-950/20 dark:border-red-900/50">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 text-sm text-green-500 bg-green-50 border border-green-100 rounded-xl dark:bg-green-950/20 dark:border-green-900/50">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register("token")} />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={isLoading}
              {...register("password")}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              {...register("confirmPassword")}
            />

            <Button type="submit" isLoading={isLoading} className="mt-2">
              Reset Password
            </Button>
          </form>
        </>
      )}

      <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Back to{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordForm;


