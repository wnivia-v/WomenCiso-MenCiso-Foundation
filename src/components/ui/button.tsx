"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-navy-800 text-white hover:bg-navy-700 focus-visible:ring-navy-500":
              variant === "default",
            "bg-gold-400 text-navy-900 hover:bg-gold-500 focus-visible:ring-gold-400":
              variant === "secondary",
            "bg-red-600 text-white hover:bg-red-700":
              variant === "destructive",
            "border border-navy-200 bg-white text-navy-800 hover:bg-navy-50":
              variant === "outline",
            "text-navy-700 hover:bg-navy-50": variant === "ghost",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm md:h-10": size === "md",
            "h-12 px-5 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
