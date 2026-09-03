import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none [&_svg]:pointer-events-none [&_svg]:size-4.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm shadow-rose-500/25 hover:from-rose-700 hover:to-red-700 active:scale-[0.98]",
        success:
          "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98]",
        warning:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98]",
        outline:
          "border border-border bg-card text-foreground shadow-xs hover:bg-secondary hover:border-primary/50 hover:text-primary active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:scale-[0.98]",
        ghost:
          "text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-4.5 py-2.5 min-h-[44px]",
        sm: "h-9 rounded-lg px-3 text-xs min-h-[36px]",
        lg: "h-12 rounded-xl px-7 text-base min-h-[48px]",
        icon: "size-11 rounded-xl min-h-[44px] min-w-[44px] p-0",
        "icon-sm": "size-9 rounded-lg min-h-[36px] min-w-[36px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
