import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "gradient" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]": variant === "default",
            "border border-[var(--color-card-border)] bg-transparent hover:bg-white/5": variant === "outline",
            "hover:bg-white/10": variant === "ghost",
            "bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90 shadow-[0_0_15px_rgba(59,130,246,0.5)]": variant === "gradient",
            "glass text-white hover:bg-white/10": variant === "glass",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
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
