import * as React from "react";
import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "custom";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
    destructive: "border-transparent bg-red-600 text-gray-50 hover:bg-red-600/80",
    outline: "text-gray-900 border-gray-300",
    custom: "border"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
