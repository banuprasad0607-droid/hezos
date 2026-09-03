import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none select-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-blue-500/25 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50",
        primary:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          "border-border bg-secondary text-secondary-foreground",
        success:
          "border-emerald-500/25 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50",
        warning:
          "border-amber-500/25 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50",
        danger:
          "border-rose-500/25 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50",
        destructive:
          "border-rose-500/25 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50",
        info:
          "border-sky-500/25 bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/50",
        violet:
          "border-violet-500/25 bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50",
        outline: "border-border text-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
