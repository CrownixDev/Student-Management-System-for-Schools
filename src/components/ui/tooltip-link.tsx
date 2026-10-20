import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import Link from "next/link";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Link> {
  tooltip: string;
  tooltipCfg?: ComponentProps<typeof TooltipContent>;
  children: React.ReactNode;
}

export default function TooltipLink({ tooltip, tooltipCfg, children, ...props }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger delay={500}>
        <Link {...props}>{children}</Link>
      </TooltipTrigger>
      <TooltipContent {...tooltipCfg}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
