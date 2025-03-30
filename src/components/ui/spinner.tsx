import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps {
  /**
   * The size of the spinner in pixels
   * @default 24
   */
  size?: number;
  /**
   * Custom className to apply additional styles
   */
  className?: string;
  /**
   * Optional text to display next to the spinner
   */
  text?: string;
  /**
   * Whether to show the text after the spinner (true) or before (false)
   * @default true
   */
  textAfter?: boolean;
  /**
   * The color of the spinner
   * @default "current" - uses the current text color
   */
  color?: "current" | "primary" | "secondary" | "muted" | "accent" | "white";
}

const colorVariants = {
  current: "text-current",
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
  accent: "text-accent-foreground",
  white: "text-white",
};

/**
 * A versatile spinner component for loading states
 */
export function Spinner({
  size = 24,
  className,
  text,
  textAfter = true,
  color = "current",
}: SpinnerProps) {
  const colorClass = colorVariants[color] || colorVariants.current;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {text && !textAfter && <span className={colorClass}>{text}</span>}
      <Loader2
        className={cn("animate-spin", colorClass)}
        size={size}
        aria-label="Loading"
      />
      {text && textAfter && <span className={colorClass}>{text}</span>}
    </div>
  );
}
