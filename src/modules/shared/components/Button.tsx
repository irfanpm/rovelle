"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Omit properties that conflict with framer-motion's motion.button props
type HTMLButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "style"
>;

export interface ButtonProps extends HTMLButtonProps {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref} // Cast ref to avoid framer-motion ref compatibility mismatches
        disabled={disabled || isLoading}
        className={cn(
          "primary w-full disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
