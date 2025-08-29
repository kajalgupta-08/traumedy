import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder:text-gray-500",
          className
        )}
        {...props} 
      />
    );
  }
);

Input.displayName = "Input";
