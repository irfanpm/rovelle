"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#2d2621] mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? inputId + "-error" : undefined}
          className={cn(
            "w-full px-4 py-3 text-xs border bg-[#fffefa] border-[#e8dfd3] text-[#2d2621] rounded-sm focus:border-[#9a6b3c]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p id={inputId + "-error"} role="alert" className="mt-1 text-[10px] text-[#9b4740]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
