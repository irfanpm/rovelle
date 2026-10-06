"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, ForgotPasswordInput } from "../schemas";
import { forgotPasswordAction } from "../actions/forgot-password";
import { Input } from "@/modules/shared/components/Input";
import { Button } from "@/modules/shared/components/Button";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await forgotPasswordAction(data);
      if (result.success) {
        setSuccess(result.message);
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
          Forgot password?
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email address and we will send you a reset link
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
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          disabled={isLoading}
          {...register("email")}
        />

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Remembered password?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;


