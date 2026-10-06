"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpSchema, VerifyOtpInput } from "../schemas";
import { verifyOtpAction } from "../actions/verify-otp";
import { Input } from "@/modules/shared/components/Input";
import { Button } from "@/modules/shared/components/Button";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyOtpInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await verifyOtpAction(data);
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
          Verify your account
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          We have sent a 6-digit verification code to{" "}
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {email}
          </span>
        </p>
      </div>

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
        <input type="hidden" {...register("email")} />

        <Input
          label="Verification Code"
          type="text"
          maxLength={6}
          placeholder="123456"
          error={errors.otp?.message}
          disabled={isLoading}
          className="text-center tracking-[0.5em] text-lg font-bold"
          {...register("otp")}
        />

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Verify Account
        </Button>
      </form>
    </div>
  );
}

export default VerifyForm;


