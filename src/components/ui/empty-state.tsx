import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/shadcn/empty";
import { cn } from "cn";
import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  noBorder = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  noBorder?: boolean;
}) {
  const Icon = icon;
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div>
        <Empty className={cn("max-w-sm", noBorder ? undefined : "border border-muted-foreground")}>
          <EmptyHeader>
            {Icon && (
              <EmptyMedia variant="icon">
                <Icon className="size-10" aria-hidden="true" />
              </EmptyMedia>
            )}
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>
          {action}
        </Empty>
      </div>
    </div>
  );
}
