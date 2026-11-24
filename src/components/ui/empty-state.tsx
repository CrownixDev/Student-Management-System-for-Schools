import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/shadcn/empty";
import { cn } from "cn";
import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon,
  title,
  description,
  description2,
  action,
  noBorder = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  description2?: string;
  action?: React.ReactNode;
  noBorder?: boolean;
}) {
  const Icon = icon;
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div>
        <Empty className={cn("max-w-sm", noBorder ? undefined : "border border-muted-foreground")}>
          <EmptyHeader>
            {Icon && <Icon className="size-10" aria-hidden="true" />}
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription className="wrap-anywhere">{description}</EmptyDescription>
            <EmptyDescription className="wrap-anywhere">{description2}</EmptyDescription>
          </EmptyHeader>
          {action}
        </Empty>
      </div>
    </div>
  );
}
