import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-sibersih-primary text-white shadow hover:bg-sibersih-primary/90",
        secondary:
          "border-transparent bg-sibersih-accent/30 text-sibersih-primary hover:bg-sibersih-accent/40",
        destructive:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        warning:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        outline: "text-sibersih-primary border border-sibersih-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
