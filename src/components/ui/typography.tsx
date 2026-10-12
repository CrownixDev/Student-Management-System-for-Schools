import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TypographyProps = HTMLAttributes<HTMLElement>;

export function TypographyH1({ className, ...props }: TypographyProps) {
  return <h1 className={cn("font-heading text-2xl font-semibold tracking-tight text-foreground", className)} {...props} />;
}

export function TypographyH2({ className, ...props }: TypographyProps) {
  return <h2 className={cn("font-heading text-lg font-semibold tracking-tight text-foreground", className)} {...props} />;
}

export function TypographyH3({ className, ...props }: TypographyProps) {
  return <h3 className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

export function TypographyP({ className, ...props }: TypographyProps) {
  return <p className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />;
}
