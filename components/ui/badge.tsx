import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-sibersih-primary text-snow-white hover:bg-sibersih-primary/90",
        secondary:
          "border-transparent bg-warm-stone text-sibersih-primary hover:bg-frosted-glass/40",
        destructive:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        warning:
          "border border-sibersih-primary/10 bg-warm-stone text-sibersih-primary",
        success:
          "border-transparent bg-lime-pulse text-forest-depths font-semibold",
        outline: "text-sibersih-primary border border-sibersih-primary/20 bg-transparent",
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
