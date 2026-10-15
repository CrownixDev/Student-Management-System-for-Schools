import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/shadcn/empty";
import { cn } from "cn";
import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  border = true,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  border?: boolean;
}) {
  const Icon = icon;
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div>
        <Empty className={cn("w-sm", border ? "border border-muted-foreground" : undefined)}>
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
