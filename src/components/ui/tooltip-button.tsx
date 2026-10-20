import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import { ComponentProps } from "react";
import { Button } from "@/components/shadcn/button";

interface Props extends ComponentProps<typeof Button> {
  tooltip: string;
  tooltipCfg?: ComponentProps<typeof TooltipContent>;
  children: React.ReactNode;
}

export default function TooltipButton({ tooltip, tooltipCfg, children, ...props }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button {...props}>{children}</Button>} delay={500} />
      <TooltipContent {...tooltipCfg}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
